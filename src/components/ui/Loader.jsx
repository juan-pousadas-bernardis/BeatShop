// src/components/ui/Loader.jsx
import React from 'react'

const Loader = ({ message = 'Cargando beats...' }) => {
  return (
    <div className="loader-wrapper" role="status" aria-live="polite">
      <div className="music-spinner"></div>
      <p className="loader-text">{message}</p>
    </div>
  )
}

export default Loader
