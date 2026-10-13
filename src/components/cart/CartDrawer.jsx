// src/components/cart/CartDrawer.jsx
import React from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import Swal from 'sweetalert2'
import {
  FaTimes,
  FaTrash,
  FaMinus,
  FaPlus,
  FaShoppingBag,
  FaMusic,
  FaCheckCircle
} from 'react-icons/fa'

const CartDrawer = () => {
  const {
    items,
    totalCount,
    totalAmount,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    clearCartSilently
  } = useCart()

  if (!isCartOpen) return null

  const handleCheckout = () => {
    // 1. Cerrar pestaña lateral inmediatamente
    closeCart()

    // 2. Vaciar el carrito de forma automática
    clearCartSilently()

    // 3. Mostrar modal de orden confirmada sin preguntar si se quiere vaciar
    Swal.fire({
      title: '¡Orden de Compra Confirmada!',
      html: `
        <div style="text-align: left; padding: 10px 0; font-size: 0.95rem;">
          <p><strong>Total de beats adquiridos:</strong> ${totalCount}</p>
          <p><strong>Monto total:</strong> $${totalAmount.toLocaleString('es-AR')}</p>
          <p style="margin-top: 12px; color: #555;">
            ¡Gracias por tu compra! Te enviamos los enlaces de descarga directa (WAV 24-bit + MP3 320kbps + Licencia Comercial) a tu correo electrónico.
          </p>
        </div>
      `,
      icon: 'success',
      confirmButtonColor: '#6741BE',
      confirmButtonText: 'Aceptar'
    })
  }

  const handleImageError = (e) => {
    e.target.onerror = null
    e.target.src = '/assets/images/products/ref_img.jpg'
  }

  return (
    <div className="cart-drawer-overlay" onClick={closeCart}>
      <div className="cart-drawer-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="cart-drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FaShoppingBag style={{ color: 'var(--color-primary)', fontSize: '1.2rem' }} />
            <h3>Tu Carrito</h3>
            <span className="cart-count-chip">{totalCount}</span>
          </div>
          <button
            type="button"
            className="cart-close-btn"
            onClick={closeCart}
            aria-label="Cerrar carrito"
          >
            <FaTimes />
          </button>
        </div>

        {/* Body */}
        <div className="cart-drawer-body">
          {items.length === 0 ? (
            <div className="cart-empty-view">
              <div className="empty-cart-icon">
                <FaMusic />
              </div>
              <h4>Tu carrito está vacío</h4>
              <p>Todavía no agregaste ningún beat a tu compra.</p>
              <Link to="/products" className="btn btn-primary" onClick={closeCart}>
                Explorar catálogo de beats
              </Link>
            </div>
          ) : (
            <div className="cart-items-list">
              {items.map((item) => {
                const itemTotal = Number(item.price || 0) * (item.quantity || 1)
                return (
                  <div key={item.id} className="cart-item-row">
                    <img
                      src={item.image || '/assets/images/products/ref_img.jpg'}
                      alt={item.name}
                      onError={handleImageError}
                      className="cart-item-thumb"
                    />

                    <div className="cart-item-info">
                      <div className="cart-item-header">
                        <h4>{item.name}</h4>
                        <button
                          type="button"
                          className="cart-item-delete"
                          onClick={() => removeFromCart(item.id)}
                          title="Eliminar beat del carrito"
                        >
                          <FaTrash />
                        </button>
                      </div>

                      {item.category && (
                        <span className="cart-item-category">{item.category}</span>
                      )}

                      <div className="cart-item-pricing">
                        <div className="qty-controls">
                          <button
                            type="button"
                            className="qty-btn"
                            onClick={() => updateQuantity(item.id, -1)}
                            title="Disminuir cantidad"
                          >
                            <FaMinus />
                          </button>
                          <span className="qty-value">{item.quantity || 1}</span>
                          <button
                            type="button"
                            className="qty-btn"
                            onClick={() => updateQuantity(item.id, 1)}
                            title="Aumentar cantidad"
                          >
                            <FaPlus />
                          </button>
                        </div>

                        <div className="cart-item-total">
                          ${itemTotal.toLocaleString('es-AR')}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="cart-subtotal-row">
              <span>Subtotal:</span>
              <span className="cart-total-amount">
                ${totalAmount.toLocaleString('es-AR')}
              </span>
            </div>

            <p className="cart-download-notice">
              <FaCheckCircle style={{ color: '#27ae60' }} /> Descarga inmediata con licencia comercial
            </p>

            <div className="cart-footer-actions">
              <button
                type="button"
                className="btn btn-primary cart-checkout-btn"
                onClick={handleCheckout}
              >
                Finalizar Compra
              </button>

              <button
                type="button"
                className="btn btn-secondary cart-clear-btn"
                onClick={clearCart}
              >
                Vaciar Carrito
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CartDrawer
