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

export default function App() {
  return (
    <React.StrictMode>
      <ErrorBoundary>
        <Router>
          <AppProviders>
            <StyleController>
              <PageHeader />
              <Routes>
                <Route path="/build/" element={<Main />} />
                <Route path="/build/index.html" element={<Navigate to="/build/" />} />
              </Routes>
            </StyleController>
          </AppProviders>
        </Router>
      </ErrorBoundary>
    </React.StrictMode>
  );
}
