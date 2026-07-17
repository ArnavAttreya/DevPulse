import React from 'react';
import { NavLink } from 'react-router-dom';
import { Activity, Search, Heart } from 'lucide-react';
import styles from './Header.module.css';

export const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <NavLink to="/" className={styles.logo}>
          <Activity className={styles.logoIcon} />
          <span>Dev<span className={styles.logoHighlight}>Pulse</span></span>
        </NavLink>
        <nav className={styles.nav}>
          <NavLink
            to="/"
            className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}
            end
          >
            <Search size={16} />
            <span>Search</span>
          </NavLink>
          <NavLink
            to="/favourites"
            className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}
          >
            <Heart size={16} />
            <span>Favourites</span>
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

export default Header;
