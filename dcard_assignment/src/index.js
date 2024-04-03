//index.js

import React from 'react';
import App from './App';
import ReactDOM from 'react-dom/client';

const root = document.getElementById('root');
const rootElement = (
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

const rootInstance = ReactDOM.createRoot(root);
rootInstance.render(rootElement);