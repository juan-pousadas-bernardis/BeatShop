// src/pages/Home.jsx
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getProducts } from '../services/products.service'
import ProductCard from '../components/ui/ProductCard'
import Loader from '../components/ui/Loader'
import { FaBolt, FaShieldAlt, FaComments, FaArrowRight } from 'react-icons/fa'

const Home = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true

    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true)
        const data = await getProducts()
        if (isMounted) {
          // Mostrar los primeros 4 beats destacados
          setProducts(Array.isArray(data) ? data.slice(0, 4) : [])
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error al cargar productos en Home:', err)
          setError('No se pudieron cargar los beats destacados.')
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchFeaturedProducts()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <main className="main-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="welcome">
          <div className="hero-text">
            <span className="hero-badge">Novedades 2026</span>
            <h1>
              Beats que <span>inspiran</span>
            </h1>
            <p>
              Descubrí los mejores beats con la calidad más profesional del mercado.
              Creatividad, flow y confianza en un solo lugar.
            </p>
            <div className="hero-buttons">
              <Link to="/products" className="btn btn-primary hero-btn">
                Explorar Beats <FaArrowRight style={{ marginLeft: '6px' }} />
              </Link>
              <Link to="/about" className="btn btn-secondary hero-btn">
                Conocé BeatShop
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="section-container">
        <div className="info-section">
          <div className="info">
            <h2>Sobre BeatShop</h2>
            <p>
              En BeatShop nos apasiona la música. Desde nuestros inicios, nos dedicamos a ofrecer los
              mejores beats del mercado, seleccionando cuidadosamente cada producción para
              garantizar la mejor experiencia a nuestros clientes.
            </p>
            <p>
              Trabajamos con los productores más reconocidos del mundo y ofrecemos asesoramiento personalizado para
              que encuentres exactamente el sonido que necesitás.
            </p>
            <p>
              Comprar en BeatShop es sinónimo de confianza, calidad y el mejor precio garantizado.
            </p>
            <Link to="/about" className="btn btn-secondary">
              Conocé más
            </Link>
          </div>
          <img
            src="/assets/images/studio.jpg"
            alt="Estudio de producción musical"
            onError={(e) => {
              e.target.onerror = null
              e.target.src = 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80'
            }}
          />
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="products-section section-container">
        <div className="section-header">
          <h2>Beats Destacados</h2>
        </div>

        {loading ? (
          <Loader message="Cargando beats destacados desde MockAPI..." />
        ) : error ? (
          <div className="empty-state">
            <p>{error}</p>
          </div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <p>No hay beats destacados disponibles por el momento.</p>
          </div>
        ) : (
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        )}

        <div style={{ width: '100%', textAlign: 'center', marginTop: '36px' }}>
          <Link to="/products" className="btn btn-secondary" style={{ padding: '12px 36px', fontSize: '1rem' }}>
            Explorar todos los beats
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-container">
        <h2>¿Por qué elegirnos?</h2>
        <div className="features-section">
          <div className="feature-item">
            <span className="feature-icon">
              <FaBolt style={{ color: 'var(--color-primary)' }} />
            </span>
            <h3>Descarga Inmediata</h3>
            <p>
              Una vez realizada la compra, recibí al instante tu beat en formato WAV y MP3 de alta calidad,
              listo para usar en tus proyectos.
            </p>
          </div>
          <div className="feature-item">
            <span className="feature-icon">
              <FaShieldAlt style={{ color: 'var(--color-primary)' }} />
            </span>
            <h3>Licencia Incluida</h3>
            <p>
              Todos nuestros beats incluyen licencia de uso comercial. Usalos en tus canciones, mixes y
              lanzamientos sin preocupaciones.
            </p>
          </div>
          <div className="feature-item">
            <span className="feature-icon">
              <FaComments style={{ color: 'var(--color-primary)' }} />
            </span>
            <h3>Soporte 24/7</h3>
            <p>
              Nuestro equipo de productores está disponible las 24 horas del día, los 7 días de la semana, para
              ayudarte a encontrar el sonido perfecto.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Home
