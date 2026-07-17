import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import UserCard from '../components/UserCard';
import RepoCard from '../components/RepoCard';
import LanguageChart from '../components/LanguageChart';
import Spinner from '../components/Spinner';
import styles from './ProfilePage.module.css';

export const ProfilePage = () => {
  const { username } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [repos, setRepos] = useState([]);
  const [languagesData, setLanguagesData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavourite, setIsFavourite] = useState(false);

  useEffect(() => {
    const favs = localStorage.getItem('devpulse_favourites');
    if (favs) {
      try {
        const parsed = JSON.parse(favs);
        const exists = parsed.some(
          (f) => f.login.toLowerCase() === username.toLowerCase()
        );
        setIsFavourite(exists);
      } catch (e) {
        setIsFavourite(false);
      }
    }
  }, [username]);

  useEffect(() => {
    const fetchProfileAndRepos = async () => {
      setLoading(true);
      setError(null);

      const headers = {};
      const token = import.meta.env.VITE_GITHUB_TOKEN;
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      try {
        const userRes = await fetch(`https://api.github.com/users/${username}`, { headers });
        if (!userRes.ok) {
          if (userRes.status === 404) {
            throw new Error(`User "${username}" not found.`);
          } else if (userRes.status === 403) {
            const limit = userRes.headers.get('X-RateLimit-Remaining');
            if (limit === '0') {
              throw new Error('API Rate Limit exceeded. Please configure VITE_GITHUB_TOKEN to bypass.');
            }
          }
          throw new Error(`Failed to load profile (status ${userRes.status})`);
        }
        const userData = await userRes.json();
        setUser(userData);

        const reposRes = await fetch(
          `https://api.github.com/users/${username}/repos?per_page=100`,
          { headers }
        );
        if (!reposRes.ok) {
          throw new Error('Failed to load repositories.');
        }
        const reposData = await reposRes.json();

        const sortedRepos = [...reposData].sort(
          (a, b) => b.stargazers_count - a.stargazers_count
        );
        setRepos(sortedRepos);

        const top6Repos = sortedRepos.slice(0, 6);
        const aggregatedLanguages = {};

        try {
          const langPromises = top6Repos.map(async (repo) => {
            const res = await fetch(
              `https://api.github.com/repos/${userData.login}/${repo.name}/languages`,
              { headers }
            );
            return res.ok ? res.json() : {};
          });

          const langsArray = await Promise.all(langPromises);

          langsArray.forEach((langObj) => {
            for (const [lang, bytes] of Object.entries(langObj)) {
              aggregatedLanguages[lang] = (aggregatedLanguages[lang] || 0) + bytes;
            }
          });

          if (Object.keys(aggregatedLanguages).length === 0) {
            reposData.forEach((repo) => {
              if (repo.language) {
                aggregatedLanguages[repo.language] = (aggregatedLanguages[repo.language] || 0) + 1;
              }
            });
          }
        } catch (langErr) {
          console.warn('Fallback to primary language aggregation:', langErr);
          reposData.forEach((repo) => {
            if (repo.language) {
              aggregatedLanguages[repo.language] = (aggregatedLanguages[repo.language] || 0) + 1;
            }
          });
        }

        setLanguagesData(aggregatedLanguages);
      } catch (err) {
        setError(err.message || 'An error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndRepos();
  }, [username]);

  const toggleFavourite = () => {
    if (!user) return;
    const favs = localStorage.getItem('devpulse_favourites');
    let currentFavs = [];
    if (favs) {
      try {
        currentFavs = JSON.parse(favs);
      } catch (e) {
        currentFavs = [];
      }
    }

    let updatedFavs = [];
    if (isFavourite) {
      updatedFavs = currentFavs.filter(
        (f) => f.login.toLowerCase() !== user.login.toLowerCase()
      );
      setIsFavourite(false);
    } else {
      const newFav = {
        login: user.login,
        name: user.name || user.login,
        avatar_url: user.avatar_url,
      };
      updatedFavs = [newFav, ...currentFavs];
      setIsFavourite(true);
    }

    localStorage.setItem('devpulse_favourites', JSON.stringify(updatedFavs));
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <button onClick={() => navigate('/')} className={styles.backButton}>
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <button onClick={() => navigate('/')} className={styles.backButton}>
          <ArrowLeft size={16} />
          <span>Back to Search</span>
        </button>

        <div className={`${styles.errorContainer} animate-fade-in`}>
          <AlertTriangle size={48} className={styles.errorIcon} />
          <h2 className={styles.errorTitle}>Something went wrong</h2>
          <p className={styles.errorMessage}>{error}</p>
          <button
            onClick={() => navigate('/')}
            className={styles.backButton}
            style={{ alignSelf: 'center', marginTop: '0.5rem' }}
          >
            Try Another Search
          </button>
        </div>
      </div>
    );
  }

  const reposToRender = repos;

  return (
    <div className={styles.container}>
      <button onClick={() => navigate('/')} className={styles.backButton}>
        <ArrowLeft size={16} />
        <span>Back</span>
      </button>

      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <UserCard
            user={user}
            isFavourite={isFavourite}
            onToggleFavourite={toggleFavourite}
          />
          <LanguageChart languagesData={languagesData} />
        </aside>

        <main className={styles.mainContent}>
          <h2 className={styles.sectionTitle}>Repositories</h2>
          {reposToRender.length > 0 ? (
            <div className={styles.reposGrid}>
              {reposToRender.map((repo) => (
                <RepoCard key={repo.id} repo={repo} username={user.login} />
              ))}
            </div>
          ) : (
            <p className={styles.errorMessage}>No public repositories found for this user.</p>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;
