import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { getLanguageColor } from '../utils/languageColors';
import styles from './LanguageChart.module.css';

ChartJS.register(ArcElement, Tooltip, Legend);

export const LanguageChart = ({ languagesData }) => {
  if (!languagesData || Object.keys(languagesData).length === 0) {
    return (
      <div className={styles.container}>
        <h3 className={styles.title}>Language Distribution</h3>
        <p className={styles.noData}>No language data available</p>
      </div>
    );
  }

  const sortedLanguages = Object.entries(languagesData)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const labels = sortedLanguages.map(([name]) => name);
  const dataValues = sortedLanguages.map(([, value]) => value);
  const backgroundColors = labels.map((name) => getLanguageColor(name));

  const total = dataValues.reduce((sum, val) => sum + val, 0);

  const data = {
    labels,
    datasets: [
      {
        data: dataValues,
        backgroundColor: backgroundColors,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        hoverOffset: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#cbd5e1',
          font: {
            family: 'Inter, sans-serif',
            size: 11,
            weight: '500'
          },
          padding: 12,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#f8fafc',
        bodyColor: '#94a3b8',
        borderColor: 'rgba(255, 255, 255, 0.08)',
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8,
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.parsed || 0;
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
            return ` ${label}: ${percentage}%`;
          },
        },
      },
    },
    cutout: '70%',
  };

  return (
    <div className={`${styles.container} animate-fade-in`}>
      <h3 className={styles.title}>Language Distribution</h3>
      <div className={styles.chartWrapper}>
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
};

export default LanguageChart;
