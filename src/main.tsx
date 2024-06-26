import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import 'react-checkbox-tree/lib/react-checkbox-tree.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
