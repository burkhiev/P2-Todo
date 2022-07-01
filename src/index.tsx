import React from 'react';
import ReactDomClient from 'react-dom/client';

import App from './App';

const rootTag = document.getElementById('root');

console.log(process.env.NODE_ENV);

if (rootTag) {
  const root = ReactDomClient.createRoot(rootTag);
  root.render(<App />);
} else {
  // eslint-disable-next-line no-console
  console.error('root section is not found');
}
