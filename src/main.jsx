// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

// Importación de hojas de estilo
import './styles/styles.css'
import './styles/home.css'
import './styles/admin.css'
import './styles/product-detail.css'
import './styles/register.css'
import './styles/login.css'
import './styles/about.css'
import './styles/contact.css'
import './styles/custom.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
