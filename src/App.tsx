import React from 'react';
import { Provider } from 'react-redux';
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from 'react-router-dom';

import PageHeader from './components/header/PageHeader';
import PageBody from './components/body/PageBody';
import ErrorBoundary from './services/ErrorBoundary';
import store from './store/store';
import Curtain from './components/serviceComponents/Curtain';
import RoutePathes from './RoutePathes';

export default function App() {
  return (
    <React.StrictMode>
      <ErrorBoundary>
        <Provider store={store}>
          <Router>
            <Curtain />
            <PageHeader />
            <main>
              <Routes>
                <Route path={RoutePathes.home} element={<PageBody />} />
              </Routes>
            </main>
          </Router>
        </Provider>
      </ErrorBoundary>
    </React.StrictMode>
  );
}
