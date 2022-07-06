import React from 'react';
import { Link } from 'react-router-dom';

import styles from './PageHeader.css';

export default function PageHeader() {
  return (
    <header className={styles.page_header}>
      <nav className={`navbar navbar-light border-bottom bg-white fixed-top ${styles.page_header}`}>
        <div className="container-fluid">
          <Link to="/" className="navbar-brand">Todo App</Link>
        </div>
      </nav>
    </header>
  );
}
