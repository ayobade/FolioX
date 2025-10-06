import React from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { PortfolioProvider } from './contexts/PortfolioContext.jsx'


createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <PortfolioProvider>
        <App />
      </PortfolioProvider>
    </AuthProvider>
  </React.StrictMode>,
)