import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Trash2, User } from 'lucide-react';
import styles from './FavouritesPage.module.css';

export const FavouritesPage = () => {
  const [favourites, setFavourites] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem('devpulse_favourites');
    if (saved) {
      try {
        setFavourites(JSON.parse(saved));
      } catch (e) {
        setFavourites([]);
      }
    }
  }, []);

  const handleRemove = (e, username) => {
    e.stopPropagation();

    const updated = favourites.filter(
      (f) => f.login.toLowerCase() !== username.toLowerCase()
    );
    setFavourites(updated);
    localStorage.setItem('devpulse_favourites', JSON.stringify(updated));
  };

  const handleCardClick = (username) => {
    navigate(`/user/${username}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.titleArea}>
        <h1 className={styles.title}>
          <Heart className={styles.titleIcon} size={28} fill="currentColor" />
          <span>Favourites</span>
        </h1>
        <p className={styles.subtitle}>
          Quickly monitor your bookmarked GitHub profiles
        </p>
      </div>

      {favourites.length > 0 ? (
        <div className={styles.grid}>
          {favourites.map((fav) => (
            <div
              key={fav.login}
              className={`${styles.favCard} animate-fade-in`}
              onClick={() => handleCardClick(fav.login)}
            >
              <img
                src={fav.avatar_url}
                alt={`${fav.login}'s avatar`}
                className={styles.avatar}
              />
              <div className={styles.info}>
                <h3 className={styles.name}>{fav.name || fav.login}</h3>
                <span className={styles.username}>@{fav.login}</span>
              </div>
              <button
                onClick={(e) => handleRemove(e, fav.login)}
                className={styles.removeButton}
                title="Remove from Favourites"
                aria-label="Remove favourite"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className={`${styles.emptyState} animate-fade-in`}>
          <Heart className={styles.emptyIcon} size={50} />
          <h2 className={styles.emptyTitle}>Your Favourites list is empty</h2>
          <p className={styles.emptyMessage}>
            Save profiles by clicking the Heart button on their profile dashboards to monitor them here.
          </p>
          <button
            onClick={() => navigate('/')}
            className={styles.searchButton}
          >
            Go to Search
          </button>
        </div>
      )}
    </div>
  );
};

export default FavouritesPage;
