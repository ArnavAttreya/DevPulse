import React from 'react';
import styles from './Spinner.module.css';

export const Spinner = () => {
  return (
    <div className={styles.container}>
      <div className={styles.spinner}>
        <div className={styles.innerCircle}></div>
      </div>
      <p className={styles.text}>Fetching GitHub data...</p>
    </div>
  );
};

export default Spinner;
