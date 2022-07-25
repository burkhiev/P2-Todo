/* eslint-disable no-console */
import React from 'react';
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';

import PageHeader from './components/header/PageHeader';
import Main from './components/main/Main';
import ErrorBoundary from './service/ErrorBoundary';
import StyleController from './components/service-components/StyleController/StyleController';
import AppProviders from './components/service-components/AppProviders/AppProviders';
import { MAIN_PATH } from './service/Consts';

console.log('path:', MAIN_PATH);

export default function App() {
  return (
    <React.StrictMode>
      <ErrorBoundary>
        <Router>
          <AppProviders>
            <StyleController>
              <PageHeader />
              <Routes>
                <Route path={MAIN_PATH} element={<Main />} />
                <Route path={`${MAIN_PATH}/index.html`} element={<Navigate to={MAIN_PATH} />} />
              </Routes>
            </StyleController>
          </AppProviders>
        </Router>
      </ErrorBoundary>
    </React.StrictMode>
  );
}
