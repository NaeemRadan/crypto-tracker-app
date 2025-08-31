import { useState, useEffect } from 'react';
import styles from './ThemeToggle.module.css';  
const ThemeToggle = () => {
 
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  useEffect(() => {
   
    document.documentElement.setAttribute('data-theme', theme);
    
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div className={styles.toggleSwitch}>
      <input
        type="checkbox"
        id="theme-switch"
        className={styles.checkbox}
        onChange={toggleTheme}
        checked={theme === 'light'}
      />
      <label htmlFor="theme-switch" className={styles.label}>
        <span className={styles.inner} />
        <span className={styles.switch} />
      </label>
    </div>
  );
};

export default ThemeToggle;
