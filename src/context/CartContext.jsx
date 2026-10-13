// src/context/CartContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import Swal from 'sweetalert2'

const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const { user } = useAuth()
  const userKey = user?.email ? `beatshop_cart_${user.email}` : 'beatshop_cart_guest'

  const [items, setItems] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)

  // Cargar el carrito específico del usuario actual cada vez que cambia el usuario
  useEffect(() => {
    try {
      const saved = localStorage.getItem(userKey)
      setItems(saved ? JSON.parse(saved) : [])
    } catch {
      setItems([])
    }
  }, [userKey])

  // Guardar en el storage del usuario correspondiente
  useEffect(() => {
    localStorage.setItem(userKey, JSON.stringify(items))
  }, [items, userKey])

  const openCart = () => setIsCartOpen(true)
  const closeCart = () => setIsCartOpen(false)
  const toggleCart = () => setIsCartOpen((prev) => !prev)

  // Cantidad total de beats en el carrito
  const totalCount = items.reduce((acc, item) => acc + (item.quantity || 1), 0)

  // Monto total en ARS
  const totalAmount = items.reduce(
    (acc, item) => acc + Number(item.price || 0) * (item.quantity || 1),
    0
  )

  const addToCart = (product) => {
    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) => String(item.id) === String(product.id)
      )

      if (existingIndex > -1) {
        const updated = [...prevItems]
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: (updated[existingIndex].quantity || 1) + 1
        }

        Swal.fire({
          title: '¡Cantidad aumentada!',
          text: `"${product.name}" ahora tiene ${updated[existingIndex].quantity} unidad(es) en tu carrito.`,
          icon: 'success',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 1800
        })

        return updated
      }

      const newItem = {
        ...product,
        quantity: 1
      }

      Swal.fire({
        title: '¡Beat agregado!',
        text: `"${product.name}" se sumó a tu carrito de compras.`,
        icon: 'success',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1800
      })

      return [...prevItems, newItem]
    })
  }

  const removeFromCart = (productId) => {
    const itemToRemove = items.find((item) => String(item.id) === String(productId))
    setItems((prevItems) => prevItems.filter((item) => String(item.id) !== String(productId)))

    if (itemToRemove) {
      Swal.fire({
        title: 'Beat removido',
        text: `"${itemToRemove.name}" fue quitado de tu carrito.`,
        icon: 'info',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1500
      })
    }
  }

  const updateQuantity = (productId, delta) => {
    setItems((prevItems) => {
      return prevItems
        .map((item) => {
          if (String(item.id) === String(productId)) {
            const newQty = (item.quantity || 1) + delta
            return newQty > 0 ? { ...item, quantity: newQty } : null
          }
          return item
        })
        .filter(Boolean)
    })
  }

  // Vaciar carrito automáticamente sin pedir confirmación (para checkout)
  const clearCartSilently = () => {
    setItems([])
    localStorage.removeItem(userKey)
  }

  // Vaciar carrito manual con confirmación
  const clearCart = () => {
    if (items.length === 0) return

    Swal.fire({
      title: '¿Vaciar carrito?',
      text: 'Se eliminarán todos los beats seleccionados.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e74c3c',
      cancelButtonColor: '#6741BE',
      confirmButtonText: 'Sí, vaciar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        clearCartSilently()
        Swal.fire({
          title: 'Carrito vacío',
          icon: 'success',
          timer: 1200,
          showConfirmButton: false
        })
      }
    })
  }

  return (
    <CartContext.Provider
      value={{
        items,
        totalCount,
        totalAmount,
        isCartOpen,
        openCart,
        closeCart,
        toggleCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        clearCartSilently
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart debe ser utilizado dentro de un CartProvider')
  }
  return context
}
