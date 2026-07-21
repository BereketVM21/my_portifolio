import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Preloader from './components/Preloader.jsx'
import './index.css'
import axios from 'axios'

// Set global API base URL for deployed environments
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || '';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Preloader is mounted outside the App's Suspense boundary so it can
        keep tracking real asset-loading progress (via drei's useProgress)
        even after any route-level Suspense fallback has resolved. */}
    <Preloader />
    <Suspense fallback={null}>
      <App />
    </Suspense>
  </React.StrictMode>,
)
