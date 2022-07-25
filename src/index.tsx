/* eslint-disable no-console */
import React from 'react';
import ReactDomClient from 'react-dom/client';

import App from './App';
import makeMockServer from './mocks/api/mirageApi';
import { MAIN_PATH } from './service/Consts';

console.log('mode:', process.env.NODE_ENV);
console.log('path:', MAIN_PATH);

// на момент первого деплоя не предполагается использование сервера
makeMockServer({});

// if (process.env.NODE_ENV === 'development') {
//   makeServer({});
// }

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = ReactDomClient.createRoot(rootElement);
  root.render(<App mainPath={MAIN_PATH} />);
} else {
  console.error('root element is not found');
}
