// src/pages/Products.jsx
import React, { useState, useEffect } from 'react'
import { getProducts } from '../services/products.service'
import ProductCard from '../components/ui/ProductCard'
import Loader from '../components/ui/Loader'
import { FaSearch, FaMusic } from 'react-icons/fa'

const CATEGORIES = ['Todos', 'Hip Hop', 'Trap', 'R&B', 'Jazz', 'House', 'Electronic', 'Latin']

const Products = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('Todos')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    let isMounted = true

    const fetchAllProducts = async () => {
      try {
        setLoading(true)
        const data = await getProducts()
        if (isMounted) {
          setProducts(Array.isArray(data) ? data : [])
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error al cargar productos:', err)
          setError('Ocurrió un error al cargar el catálogo de beats.')
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchAllProducts()

    return () => {
      isMounted = false
    }
  }, [])

  // Filtrado por categoría y búsqueda de texto
  const filteredProducts = products.filter((prod) => {
    const matchesCategory =
      selectedCategory === 'Todos' ||
      (prod.category && prod.category.toLowerCase() === selectedCategory.toLowerCase())

    const query = searchQuery.trim().toLowerCase()
    const matchesSearch =
      !query ||
      (prod.name && prod.name.toLowerCase().includes(query)) ||
      (prod.description && prod.description.toLowerCase().includes(query)) ||
      (prod.category && prod.category.toLowerCase().includes(query))

    return matchesCategory && matchesSearch
  })

  return (
    <main className="main-container">
      <section className="products-section catalog-section section-container">
        <div className="section-header">
          <h2>Todos los Beats</h2>
        </div>

        {/* Controles de búsqueda y filtros */}
        <div className="catalog-controls">
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Buscar por nombre, género o estilo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="category-pills">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`pill-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Contenido / Grilla de productos */}
        {loading ? (
          <Loader message="Cargando catálogo completo de beats..." />
        ) : error ? (
          <div className="empty-state">
            <p>{error}</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="empty-state">
            <FaMusic />
            <p>No se encontraron beats que coincidan con tu búsqueda.</p>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ marginTop: '16px' }}
              onClick={() => {
                setSelectedCategory('Todos')
                setSearchQuery('')
              }}
            >
              Restablecer filtros
            </button>
          </div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

export default Products
