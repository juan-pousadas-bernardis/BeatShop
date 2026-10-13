// src/components/layout/Navbar.jsx
import React, { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { FaShoppingCart, FaBars, FaTimes, FaSignOutAlt, FaUserEdit } from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import ProfileModal from '../profile/ProfileModal'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()
  const { totalCount, openCart } = useCart()

  const toggleMenu = () => setIsMenuOpen((prev) => !prev)
  const closeMenu = () => setIsMenuOpen(false)

  const handleLogoutClick = (e) => {
    e.preventDefault()
    closeMenu()
    logout()
  }

  const handleCartClick = (e) => {
    e.preventDefault()
    closeMenu()
    openCart()
  }

  const handleAvatarClick = (e) => {
    e.preventDefault()
    closeMenu()
    setIsProfileOpen(true)
  }

  // Foto circular del usuario actual (campo "image" de MockAPI)
  const userAvatarSrc = user?.image || user?.avatar || '/assets/images/user2.png'
  const userNameDisplay = user?.name || user?.fullname || 'Mi Cuenta'

  return (
    <>
      <header className="main-header">
        <section className="header-section">
          {/* Logo */}
          <Link to="/" className="logo" onClick={closeMenu}>
            <span>Beat</span>Shop
          </Link>

          {/* Navegación Principal */}
          <nav>
            <ul
              className={`nav-list ${isMenuOpen ? 'mobile-active' : ''}`}
              style={isMenuOpen ? { left: 0 } : {}}
            >
              <li>
                <NavLink to="/" onClick={closeMenu} end>
                  Inicio
                </NavLink>
              </li>
              <li>
                <NavLink to="/products" onClick={closeMenu}>
                  Beats
                </NavLink>
              </li>
              <li>
                <NavLink to="/contact" onClick={closeMenu}>
                  Contacto
                </NavLink>
              </li>
              <li>
                <NavLink to="/about" onClick={closeMenu}>
                  Acerca de
                </NavLink>
              </li>
              <li>
                {/* Única pestaña de Admin en la barra superior */}
                <NavLink to="/admin" onClick={closeMenu}>
                  Admin
                </NavLink>
              </li>

              {/* Acciones de usuario en menú móvil */}
              <li className="nav-user-mobile">
                {isAuthenticated ? (
                  <>
                    <button
                      type="button"
                      className="user-profile-badge mobile"
                      onClick={handleAvatarClick}
                      style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      <img
                        src={userAvatarSrc}
                        alt={userNameDisplay}
                        className="nav-avatar-circular"
                        onError={(e) => {
                          e.target.onerror = null
                          e.target.src = '/assets/images/user2.png'
                        }}
                      />
                      <span className="user-greeting">
                        Hola, {userNameDisplay} <FaUserEdit style={{ marginLeft: '4px' }} />
                      </span>
                    </button>
                    <button
                      type="button"
                      className="login-btn btn-logout"
                      onClick={handleLogoutClick}
                    >
                      <FaSignOutAlt /> Cerrar sesión
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="user-avatar" onClick={closeMenu}>
                      <img src="/assets/images/user2.png" alt="Usuario" />
                    </Link>
                    <Link to="/login" className="login-btn" onClick={closeMenu}>
                      Ingresar
                    </Link>
                  </>
                )}
              </li>
            </ul>
          </nav>

          {/* Área de Usuario en Escritorio */}
          <div className="user-area">
            {/* Ícono de Carrito con Contador Reactivo */}
            <button
              type="button"
              className="cart-icon-btn"
              onClick={handleCartClick}
              title="Abrir carrito"
              aria-label="Abrir carrito"
            >
              <FaShoppingCart />
              <span className="cart-badge-count">{totalCount}</span>
            </button>

            {isAuthenticated ? (
              <div className="user-logged-box desktop-only">
                {/* Al tocar la foto se abre el modal para editar el perfil */}
                <button
                  type="button"
                  className="user-avatar-btn"
                  onClick={handleAvatarClick}
                  title="Hacé clic para editar tu perfil"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  <img
                    src={userAvatarSrc}
                    alt={userNameDisplay}
                    className="nav-avatar-circular"
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = '/assets/images/user2.png'
                    }}
                  />
                </button>
                <span
                  className="user-name-label"
                  onClick={handleAvatarClick}
                  style={{ cursor: 'pointer' }}
                  title="Editar perfil"
                >
                  {userNameDisplay}
                </span>
                <button
                  type="button"
                  className="login-btn btn-logout"
                  onClick={handleLogoutClick}
                  title="Cerrar sesión"
                >
                  <FaSignOutAlt /> Cerrar sesión
                </button>
              </div>
            ) : (
              <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <Link to="/login" className="user-avatar" title="Mi perfil">
                  <img src="/assets/images/user2.png" alt="Usuario" />
                </Link>
                <Link to="/login" className="login-btn">
                  Ingresar
                </Link>
              </div>
            )}
          </div>

          {/* Acciones para Móvil */}
          <div className="header-actions">
            <button
              type="button"
              className="cart-icon-btn"
              onClick={handleCartClick}
              aria-label="Carrito"
            >
              <FaShoppingCart />
              <span className="cart-badge-count">{totalCount}</span>
            </button>

            <button
              type="button"
              className="menu-toggle-label"
              onClick={toggleMenu}
              aria-label="Abrir menú"
              style={{
                background: 'none',
                border: 'none',
                fontSize: '1.4rem',
                color: 'var(--color-text)',
                cursor: 'pointer'
              }}
            >
              {isMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </section>
      </header>

      {/* Modal para editar perfil al hacer clic en el avatar */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </>
  )
}

export default Navbar
