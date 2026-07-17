import React from 'react';
import { MapPin, Building, Link as LinkIcon, Calendar, Heart, ExternalLink } from 'lucide-react';
import styles from './UserCard.module.css';

export const UserCard = ({ user, isFavourite, onToggleFavourite }) => {
  if (!user) return null;

  const joinDate = user.created_at
    ? new Date(user.created_at).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  return (
    <div className={`${styles.card} animate-fade-in`}>
      <div className={styles.header}>
        <div className={styles.avatarContainer}>
          <img
            src={user.avatar_url}
            alt={`${user.login}'s avatar`}
            className={styles.avatar}
          />
        </div>
        <div className={styles.info}>
          <h2 className={styles.name}>{user.name || user.login}</h2>
          <span className={styles.username}>@{user.login}</span>
        </div>
        <button
          className={`${styles.favButton} ${isFavourite ? styles.isFav : ''}`}
          onClick={onToggleFavourite}
          title={isFavourite ? "Remove from favourites" : "Add to favourites"}
          aria-label="Toggle favourite"
        >
          <Heart size={20} fill={isFavourite ? "currentColor" : "none"} />
        </button>
      </div>

      {user.bio && <p className={styles.bio}>{user.bio}</p>}

      <div className={styles.details}>
        {user.location && (
          <div className={styles.detailItem}>
            <MapPin size={16} className={styles.detailIcon} />
            <span>{user.location}</span>
          </div>
        )}
        {user.company && (
          <div className={styles.detailItem}>
            <Building size={16} className={styles.detailIcon} />
            <span>{user.company}</span>
          </div>
        )}
        {user.blog && (
          <div className={styles.detailItem}>
            <LinkIcon size={16} className={styles.detailIcon} />
            <a
              href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.blogLink}
            >
              {user.blog}
            </a>
          </div>
        )}
        {user.created_at && (
          <div className={styles.detailItem}>
            <Calendar size={16} className={styles.detailIcon} />
            <span>Joined {joinDate}</span>
          </div>
        )}
      </div>

      <div className={styles.stats}>
        <div className={styles.statItem}>
          <span className={styles.statValue}>{user.public_repos.toLocaleString()}</span>
          <span className={styles.statLabel}>Repositories</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statValue}>{user.followers.toLocaleString()}</span>
          <span className={styles.statLabel}>Followers</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statValue}>{user.following.toLocaleString()}</span>
          <span className={styles.statLabel}>Following</span>
        </div>
      </div>

      <div className={styles.footer}>
        <a
          href={user.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.githubLink}
        >
          <span>GitHub Profile</span>
          <ExternalLink size={14} />
        </a>
      </div>
    </div>
  );
};

export default UserCard;
