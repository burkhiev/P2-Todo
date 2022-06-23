import React from 'react';
import { Provider } from 'react-redux';
import {
  BrowserRouter as Router,
  Route,
  Routes
} from 'react-router-dom';

import PageHeader from './components/header/PageHeader';
import PageBody from './components/body/PageBody';
import { homepage } from './Routes';
import ErrorBoundary from './services/ErrorBoundary';
import store from './store/store';

export default function App() {
  return (
    <React.StrictMode>
      <ErrorBoundary>
        <Provider store={store}>
          <Router>
            <PageHeader />
            <main>
              <Routes>
                <Route path={homepage} element={<PageBody />} />
              </Routes>
            </main>
          </Router>
        </Provider>
      </ErrorBoundary>
    </React.StrictMode>
  );
}
