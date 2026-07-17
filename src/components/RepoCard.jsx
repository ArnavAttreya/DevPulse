import React from 'react';
import { Link } from 'react-router-dom';
import { Star, GitFork, BookMarked } from 'lucide-react';
import { getLanguageColor } from '../utils/languageColors';
import styles from './RepoCard.module.css';

export const RepoCard = ({ repo, username }) => {
  if (!repo) return null;
  const langColor = getLanguageColor(repo.language);

  return (
    <Link
      to={`/user/${username}/repo/${repo.name}`}
      className={`${styles.card} animate-fade-in`}
    >
      <div className={styles.top}>
        <h3 className={styles.title}>
          <BookMarked size={16} className={styles.statIcon} />
          {repo.name}
        </h3>
        <p className={styles.description}>
          {repo.description || "No description provided."}
        </p>
      </div>

      <div className={styles.stats}>
        {repo.language && (
          <div className={styles.lang}>
            <span
              className={styles.langCircle}
              style={{ backgroundColor: langColor }}
            ></span>
            <span>{repo.language}</span>
          </div>
        )}
        <div className={styles.statItem} title="Stars">
          <Star size={14} className={styles.statIcon} />
          <span>{repo.stargazers_count.toLocaleString()}</span>
        </div>
        <div className={styles.statItem} title="Forks">
          <GitFork size={14} className={styles.statIcon} />
          <span>{repo.forks_count.toLocaleString()}</span>
        </div>
      </div>
    </Link>
  );
};

export default RepoCard;
