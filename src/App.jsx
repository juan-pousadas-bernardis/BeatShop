// src/App.jsx
import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'

// Layout & UI
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import CartDrawer from './components/cart/CartDrawer'

// Páginas
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Register from './pages/Register'
import Login from './pages/Login'
import Admin from './pages/Admin'
import About from './pages/About'
import Contact from './pages/Contact'

// Helper para scrollear hacia arriba en cambios de ruta
const ScrollToTop = () => {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

// Página 404 No Encontrado
const NotFound = () => (
  <main className="main-container">
    <section className="section-container" style={{ textAlign: 'center', padding: '100px 20px' }}>
      <h1 style={{ fontSize: '3.5rem', color: 'var(--color-primary)', marginBottom: '16px' }}>404</h1>
      <h2>Página no encontrada</h2>
      <p style={{ margin: '20px 0', color: 'var(--color-text-light)' }}>
        La ruta a la que intentás acceder no existe o fue modificada.
      </p>
      <a href="/" className="btn btn-primary">
        Volver al inicio
      </a>
    </section>
  </main>
)

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Navbar />
          <CartDrawer />
          <Routes>
            {/* Rutas Públicas */}
            <Route path="/" element={<Home />} />

            {/* Rutas de detalle antes de la ruta general */}
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/products" element={<Products />} />

            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />

            {/* Panel de Administración Unificado */}
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin-products" element={<Admin />} />
            <Route path="/admin-users" element={<Admin />} />

            {/* 404 Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
