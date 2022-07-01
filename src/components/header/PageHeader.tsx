import React from 'react';
import { Link } from 'react-router-dom';

import styles from './PageHeader.css';

import RoutePathes from '../../RoutePathes';

export default function PageHeader() {
  return (
    <header>
      <nav className={`navbar navbar-light border-bottom bg-white bg-opacity-75 fixed-top ${styles.page_header}`}>
        <div className="container-fluid">
          <Link to={RoutePathes.home} className="navbar-brand">Todo App</Link>
        </div>
      </nav>
      <div className={`${styles.page_header}`} />
    </header>
  );
}
