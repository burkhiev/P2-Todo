/* eslint-disable no-console */
import React from 'react';
import ReactDomClient from 'react-dom/client';

import App from './App';
import makeServer from './mock-api/mirageApi';

console.log(process.env.NODE_ENV);

if (process.env.NODE_ENV === 'development') {
  makeServer({});
}

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = ReactDomClient.createRoot(rootElement);
  root.render(<App />);
} else {
  console.error('root element is not found');
}
