import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, AlertCircle } from 'lucide-react';
import Spinner from '../components/Spinner';
import styles from './SearchPage.module.css';

export const SearchPage = () => {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem('devpulse_search_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        setHistory([]);
      }
    }
  }, []);

  const saveToHistory = (name) => {
    const cleaned = name.trim();
    if (!cleaned) return;

    const updated = [cleaned, ...history.filter(h => h.toLowerCase() !== cleaned.toLowerCase())].slice(0, 8);
    setHistory(updated);
    localStorage.setItem('devpulse_search_history', JSON.stringify(updated));
  };

  const handleSearch = async (searchTerm) => {
    const targetUsername = searchTerm.trim();
    if (!targetUsername) return;

    setLoading(true);
    setError(null);

    try {
      const headers = {};
      const token = import.meta.env.VITE_GITHUB_TOKEN;
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(`https://api.github.com/users/${targetUsername}`, { headers });

      if (!res.ok) {
        if (res.status === 404) {
          throw new Error(`GitHub user "${targetUsername}" not found. Please check spelling.`);
        } else if (res.status === 403) {
          const rateLimitRemaining = res.headers.get('X-RateLimit-Remaining');
          if (rateLimitRemaining === '0') {
            throw new Error('API rate limit exceeded. Please configure VITE_GITHUB_TOKEN to increase limits.');
          }
        }
        throw new Error(`GitHub API returned status code ${res.status}`);
      }

      const data = await res.json();
      saveToHistory(data.login);
      navigate(`/user/${data.login}`);
    } catch (err) {
      setError(err.message || 'An error occurred during search.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch(username);
  };

  return (
    <div className={styles.container}>
      <div className={`${styles.searchBox} animate-fade-in`}>
        <div className={styles.titleArea}>
          <h1 className={styles.title}>DevPulse</h1>
          <p className={styles.subtitle}>Track GitHub profiles, repositories, and languages in real-time</p>
        </div>

        {loading ? (
          <Spinner />
        ) : (
          <>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.inputWrapper}>
                <Search className={styles.inputIcon} size={18} />
                <input
                  type="text"
                  placeholder="Enter GitHub username..."
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={styles.input}
                  required
                  autoFocus
                />
              </div>
              <button type="submit" className={styles.button}>
                Search
              </button>
            </form>

            {error && (
              <div className={styles.error}>
                <AlertCircle size={20} style={{ flexShrink: 0 }} />
                <span>{error}</span>
              </div>
            )}

            {history.length > 0 && (
              <div className={styles.history}>
                <h3 className={styles.historyTitle}>Recent Searches</h3>
                <div className={styles.historyList}>
                  {history.map((user) => (
                    <button
                      key={user}
                      onClick={() => handleSearch(user)}
                      className={styles.historyItem}
                    >
                      {user}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
