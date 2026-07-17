import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, GitFork, AlertCircle, Info, BookOpen, Clock } from 'lucide-react';
import { marked } from 'marked';
import { getLanguageColor } from '../utils/languageColors';
import { formatDate } from '../utils/formatDate';
import Spinner from '../components/Spinner';
import styles from './RepoDetailPage.module.css';

export const RepoDetailPage = () => {
  const { username, reponame } = useParams();
  const navigate = useNavigate();

  const [repo, setRepo] = useState(null);
  const [commits, setCommits] = useState([]);
  const [readmeHtml, setReadmeHtml] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const decodeBase64Utf8 = (base64) => {
    try {
      const binary = atob(base64.replace(/\s/g, ''));
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      return new TextDecoder('utf-8').decode(bytes);
    } catch (e) {
      console.error('Base64 UTF-8 decoding failed, trying standard fallback:', e);
      try {
        return atob(base64);
      } catch (err) {
        return 'Unable to decode repository README content.';
      }
    }
  };

  useEffect(() => {
    const fetchAllDetails = async () => {
      setLoading(true);
      setError(null);

      const headers = {};
      const token = import.meta.env.VITE_GITHUB_TOKEN;
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      try {
        const repoRes = await fetch(
          `https://api.github.com/repos/${username}/${reponame}`,
          { headers }
        );
        if (!repoRes.ok) {
          if (repoRes.status === 404) {
            throw new Error(`Repository "${username}/${reponame}" not found.`);
          }
          throw new Error(`Failed to load repository details (status ${repoRes.status})`);
        }
        const repoData = await repoRes.json();
        setRepo(repoData);

        try {
          const commitsRes = await fetch(
            `https://api.github.com/repos/${username}/${reponame}/commits?per_page=5`,
            { headers }
          );
          if (commitsRes.ok) {
            const commitsData = await commitsRes.json();
            setCommits(Array.isArray(commitsData) ? commitsData : []);
          } else {
            console.warn(`Commits fetch returned status ${commitsRes.status}`);
            setCommits([]);
          }
        } catch (commitErr) {
          console.error('Error fetching commits:', commitErr);
          setCommits([]);
        }

        try {
          const readmeRes = await fetch(
            `https://api.github.com/repos/${username}/${reponame}/readme`,
            { headers }
          );
          if (readmeRes.ok) {
            const readmeData = await readmeRes.json();
            if (readmeData.content) {
              const decodedMarkdown = decodeBase64Utf8(readmeData.content);
              const html = await marked.parse(decodedMarkdown);
              setReadmeHtml(html);
            }
          } else {
            setReadmeHtml('');
          }
        } catch (readmeErr) {
          console.error('Error fetching README:', readmeErr);
          setReadmeHtml('');
        }
      } catch (err) {
        setError(err.message || 'Failed to load repository details.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllDetails();
  }, [username, reponame]);

  if (loading) {
    return (
      <div className={styles.container}>
        <button onClick={() => navigate(`/user/${username}`)} className={styles.backButton}>
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
        <button onClick={() => navigate(`/user/${username}`)} className={styles.backButton}>
          <ArrowLeft size={16} />
          <span>Back to Profile</span>
        </button>
        <div className={styles.headerCard}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--accent-red)' }}>
            <AlertCircle size={32} />
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800 }}>Error Loading Repository</h2>
          </div>
          <p className={styles.repoDescription}>{error}</p>
        </div>
      </div>
    );
  }

  const langColor = getLanguageColor(repo?.language);

  return (
    <div className={styles.container}>
      <button onClick={() => navigate(`/user/${username}`)} className={styles.backButton}>
        <ArrowLeft size={16} />
        <span>Back to Profile</span>
      </button>

      <div className={`${styles.headerCard} animate-fade-in`}>
        <h1 className={styles.repoName}>{repo?.name}</h1>
        {repo?.description && <p className={styles.repoDescription}>{repo.description}</p>}
        <div className={styles.metaStats}>
          {repo?.language && (
            <div className={styles.metaBadge}>
              <span className={styles.langCircle} style={{ backgroundColor: langColor }}></span>
              <span>{repo.language}</span>
            </div>
          )}
          <div className={styles.metaBadge} title="Stars count">
            <Star size={14} className={styles.badgeIcon} />
            <span>{repo?.stargazers_count.toLocaleString()} stars</span>
          </div>
          <div className={styles.metaBadge} title="Forks count">
            <GitFork size={14} className={styles.badgeIcon} />
            <span>{repo?.forks_count.toLocaleString()} forks</span>
          </div>
          <div className={styles.metaBadge} title="Open issues">
            <Info size={14} className={styles.badgeIcon} />
            <span>{repo?.open_issues_count.toLocaleString()} open issues</span>
          </div>
        </div>
      </div>

      <div className={styles.layout}>
        <div className={`${styles.contentCard} animate-fade-in`}>
          <h2 className={styles.cardTitle}>
            <BookOpen size={18} className={styles.badgeIcon} />
            <span>README.md</span>
          </h2>
          {readmeHtml ? (
            <div
              className={styles.readmeContent}
              dangerouslySetInnerHTML={{ __html: readmeHtml }}
            />
          ) : (
            <p className={styles.noReadme}>No README.md content found for this repository.</p>
          )}
        </div>

        <aside className={`${styles.contentCard} animate-fade-in`}>
          <h2 className={styles.cardTitle}>
            <Clock size={18} className={styles.badgeIcon} />
            <span>Recent Commits</span>
          </h2>
          {commits.length > 0 ? (
            <div className={styles.commitsList}>
              {commits.map((c) => (
                <div key={c.sha} className={styles.commitItem}>
                  <div className={styles.commitDot}></div>
                  <span className={styles.commitMessage}>
                    {c.commit?.message.split('\n')[0]}
                  </span>
                  <div className={styles.commitMeta}>
                    <span className={styles.commitAuthor}>
                      {c.commit?.author?.name || c.author?.login}
                    </span>
                    <span>•</span>
                    <span>{formatDate(c.commit?.author?.date)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className={styles.noReadme} style={{ padding: '1rem 0' }}>No commits found or empty repository.</p>
          )}
        </aside>
      </div>
    </div>
  );
};

export default RepoDetailPage;
