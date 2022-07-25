import React from 'react';
import { Link } from 'react-router-dom';

import styles from './pageHeader1.css';

export default function PageHeader() {
  return (
    <header className={styles.page_header}>
      <nav className={`navbar navbar-light border-bottom fixed-top ${styles.page_header}`}>
        <div className="container-fluid">
          <Link to="/" className="navbar-brand ms-4 text-white">Todo App</Link>
        </div>
      </nav>
    </header>
  );
}
