import React from 'react';
import ReactDomClient from 'react-dom/client';

import App from './App';

const rootTag = document.getElementById('root');

if (rootTag) {
  const root = ReactDomClient.createRoot(rootTag);
  root.render(<App />);
} else {
  console.error('root section is not found');
}
