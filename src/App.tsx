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

interface IAppProps {
  mainPath: string
}

export default function App(props: IAppProps) {
  const { mainPath } = props;

  return (
    <React.StrictMode>
      <ErrorBoundary>
        <Router>
          <AppProviders>
            <StyleController>
              <PageHeader />
              <Routes>
                <Route path={mainPath} element={<Main />} />
                <Route path={`${mainPath}/index.html`} element={<Navigate to={mainPath} />} />
              </Routes>
            </StyleController>
          </AppProviders>
        </Router>
      </ErrorBoundary>
    </React.StrictMode>
  );
}
