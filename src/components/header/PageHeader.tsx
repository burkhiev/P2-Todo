import React from 'react';
import { Link } from 'react-router-dom';

import './pageHeader.css';

import RoutePathes from '../../RoutePathes';

export default function PageHeader() {
  return (
    <header>
      <nav className="navbar navbar-light border-bottom bg-white bg-opacity-75 fixed-top page-header">
        <div className="container-fluid">
          <Link to={RoutePathes.home} className="navbar-brand">Todo App</Link>
        </div>
      </nav>
      <div className="page-header" />
    </header>
  );
}
