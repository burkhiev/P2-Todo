import React from 'react';
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';

import PageHeader from './components/header/PageHeader';
import Main from './components/body/Main';
import ErrorBoundary from './service/ErrorBoundary';
import StyleController from './components/service-components/StyleController/StyleController';
import AppProviders from './components/service-components/AppProviders/AppProviders';

export default function App() {
  return (
    <React.StrictMode>
      <ErrorBoundary>
        <AppProviders>
          <StyleController>
            <Router>
              <PageHeader />
              <Routes>
                <Route index element={<Main />} />
                <Route path="/index.html" element={<Navigate to="/" />} />
              </Routes>
            </Router>
          </StyleController>
        </AppProviders>
      </ErrorBoundary>
    </React.StrictMode>
  );
}
