// src/components/ui/ProductCard.jsx
import React, { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import Swal from 'sweetalert2'
import { FaBolt, FaEye, FaCartPlus, FaVolumeUp } from 'react-icons/fa'

const ProductCard = ({ product }) => {
  const { addToCart } = useCart()
  const { id, name, price, description, image, category, bpm, audioUrl, audrioUrl } = product
  const audioSrc = audioUrl || audrioUrl

  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)

  // Reproducir automáticamente cuando el cursor pasa por encima de la tarjeta
  const handleMouseEnter = () => {
    if (audioSrc && audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          // Si el navegador bloquea el autoplay sin interacción previa, no rompe
          setIsPlaying(false)
        })
    }
  }

  // Pausar al sacar el cursor
  const handleMouseLeave = () => {
    if (audioSrc && audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      setIsPlaying(false)
    }
  }

  // Añadir rápido al carrito desde el botón del carrito con +
  const handleQuickAdd = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product)
  }

  // Comprar directo: abre el cartel de confirmación sin mandarte al carrito
  const handleBuyDirectly = (e) => {
    e.preventDefault()
    Swal.fire({
      title: '¡Compra Directa Confirmada!',
      html: `
        <div style="text-align: left; padding: 6px 0;">
          <p>Has adquirido el beat <strong>"${name}"</strong> por <strong>$${Number(price || 0).toLocaleString('es-AR')}</strong>.</p>
          <p style="margin-top: 10px; color: #555; font-size: 0.9rem;">
            Se ha emitido tu licencia comercial y los enlaces de descarga (WAV + MP3 + Stems) han sido generados.
          </p>
        </div>
      `,
      icon: 'success',
      confirmButtonColor: '#6741BE',
      confirmButtonText: 'Descargar Beat'
    })
  }

  const handleImageError = (e) => {
    e.target.onerror = null
    e.target.src = '/assets/images/products/ref_img.jpg'
  }

  const formattedPrice = `$${Number(price || 0).toLocaleString('es-AR')}`

  return (
    <div
      className="card"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Audio oculto controlado por el hover de la tarjeta */}
      {audioSrc && (
        <audio ref={audioRef} src={audioSrc} preload="none" />
      )}

      <div className="card-header">
        <img
          src={image || '/assets/images/products/ref_img.jpg'}
          alt={name}
          onError={handleImageError}
          loading="lazy"
        />
        {category && <span className="card-category">{category}</span>}
        {bpm && <span className="card-bpm-tag">{bpm} BPM</span>}

        {/* Botón flotante para añadir rápido al carrito */}
        <button
          type="button"
          className="card-quick-cart-btn"
          onClick={handleQuickAdd}
          title="Añadir beat al carrito (+)"
          aria-label="Añadir al carrito"
        >
          <FaCartPlus />
        </button>
      </div>

      <div className="card-body">
        <h3>{name}</h3>
        <p>{description}</p>

        {/* Onda de sonido estética cuando se reproduce al pasar el mouse */}
        {isPlaying && (
          <div className="audio-preview-indicator">
            <FaVolumeUp />
            <span>Escuchando demo...</span>
            <div className="equalizer-wave">
              <span className="equalizer-bar"></span>
              <span className="equalizer-bar"></span>
              <span className="equalizer-bar"></span>
              <span className="equalizer-bar"></span>
            </div>
          </div>
        )}

        <div className="card-price">{formattedPrice}</div>

        <div className="card-actions">
          <button
            type="button"
            onClick={handleBuyDirectly}
            className="btn btn-primary"
            title="Comprar directamente"
          >
            <FaBolt /> Comprar
          </button>

          <Link
            to={`/products/${id}`}
            className="btn btn-secondary"
            title="Ver detalles"
          >
            <FaEye /> Ver más
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
