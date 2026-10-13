// src/pages/ProductDetail.jsx
import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getProductById } from '../services/products.service'
import { useCart } from '../context/CartContext'
import Loader from '../components/ui/Loader'
import Swal from 'sweetalert2'
import { FaShoppingCart, FaArrowLeft, FaCheckCircle, FaBolt, FaVolumeUp } from 'react-icons/fa'

const ProductDetail = () => {
  const { id } = useParams()
  const { addToCart } = useCart()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true

    const fetchProduct = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getProductById(id)
        if (isMounted) {
          setProduct(data)
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error al obtener el producto:', err)
          setError('El beat solicitado no fue encontrado o hubo un error al consultar MockAPI.')
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    if (id) {
      fetchProduct()
    }

    return () => {
      isMounted = false
    }
  }, [id])

  const handleBuyNow = () => {
    Swal.fire({
      title: '¡Compra Confirmada!',
      html: `
        <div style="text-align: left; padding: 6px 0;">
          <p>Has iniciado la compra de <strong>"${product.name}"</strong> por <strong>$${Number(product.price || 0).toLocaleString('es-AR')}</strong>.</p>
          <p style="margin-top: 10px; color: #555; font-size: 0.9rem;">
            Te hemos generado los enlaces de descarga directa y la licencia comercial ilimitada a tu cuenta.
          </p>
        </div>
      `,
      icon: 'success',
      confirmButtonColor: '#6741BE',
      confirmButtonText: 'Descargar archivos'
    })
  }

  const handleAddToCart = () => {
    addToCart(product)
  }

  const handleImageError = (e) => {
    e.target.onerror = null
    e.target.src = '/assets/images/products/ref_img.jpg'
  }

  if (loading) {
    return (
      <main className="main-container">
        <section className="section-container">
          <Loader message="Cargando detalles del beat desde MockAPI..." />
        </section>
      </main>
    )
  }

  if (error || !product) {
    return (
      <main className="main-container">
        <section className="section-container" style={{ textAlign: 'center' }}>
          <h2>Beat no encontrado</h2>
          <p style={{ margin: '20px 0', color: 'var(--color-text-light)' }}>
            {error || 'No pudimos encontrar el beat seleccionado.'}
          </p>
          <Link to="/products" className="btn btn-primary">
            <FaArrowLeft style={{ marginRight: '8px' }} /> Volver al catálogo de beats
          </Link>
        </section>
      </main>
    )
  }

  const formattedPrice = `$${Number(product.price || 0).toLocaleString('es-AR')}`
  const audio = product.audioUrl || product.audrioUrl

  return (
    <main className="main-container">
      <section className="section-container">
        <div className="detail-section">
          {/* Imagen y ficha técnica */}
          <div className="detail-image">
            <img
              src={product.image || '/assets/images/products/ref_img.jpg'}
              alt={product.name}
              onError={handleImageError}
            />
            <div className="detail-meta">
              <span>
                <strong>BPM:</strong> {product.bpm || '92'}
              </span>
              <span>
                <strong>Género:</strong> {product.category || 'Hip Hop'}
              </span>
              <span>
                <strong>Tonalidad:</strong> {product.key || 'Dm'}
              </span>
              <span>
                <strong>Licencia:</strong> Uso comercial ilimitado
              </span>
              <span>
                <strong>Formato de entrega:</strong> WAV 24-bit + MP3 320kbps + Stems
              </span>
            </div>
          </div>

          {/* Información del Beat */}
          <div className="detail-info">
            <span className="product-category">{product.category || 'Exclusivo'}</span>
            <h1>{product.name}</h1>

            {/* Reproductor de Audio si existe audioUrl en la API */}
            {audio && (
              <div style={{ margin: '16px 0', padding: '12px', background: 'var(--color-bg-alt)', borderRadius: '8px' }}>
                <p style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <FaVolumeUp /> Escuchar Preview
                </p>
                <audio controls src={audio} style={{ width: '100%' }}>
                  Tu navegador no soporta el reproductor de audio.
                </audio>
              </div>
            )}

            <div className="detail-price">{formattedPrice}</div>
            <p className="description">
              {product.description ||
                'Beat instrumental de alta calidad listo para grabar. Incluye mezcla y master profesional.'}
            </p>

            <button
              type="button"
              onClick={handleBuyNow}
              className="btn btn-primary buy-now-btn"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <FaBolt /> Comprar ya
            </button>

            <div className="detail-actions">
              <button
                type="button"
                onClick={handleAddToCart}
                className="btn btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <FaShoppingCart /> Agregar al carrito
              </button>
              <Link to="/products" className="btn btn-secondary">
                <FaArrowLeft style={{ marginRight: '6px' }} /> Volver a beats
              </Link>
            </div>

            <div style={{ marginTop: '28px', padding: '16px', background: 'var(--color-bg-alt)', borderRadius: '8px' }}>
              <p style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'var(--color-text)' }}>
                <FaCheckCircle style={{ color: '#27ae60' }} />
                <span>Descarga instantánea tras la confirmación del pago</span>
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default ProductDetail
