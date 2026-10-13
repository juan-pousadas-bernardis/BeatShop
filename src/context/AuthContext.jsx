// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react'
import Swal from 'sweetalert2'

const AuthContext = createContext()

const AUTH_STORAGE_KEY = 'beatshop_current_user'

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY)
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user))
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY)
    }
  }, [user])

  const login = (userData) => {
    // Normalizar avatar / foto del usuario
    const normalizedUser = {
      ...userData,
      name: userData.name || userData.fullname || userData.email.split('@')[0],
      avatar: userData.avatar || userData.image || userData.photo || '/assets/images/user2.png'
    }
    setUser(normalizedUser)
    return normalizedUser
  }

  const logout = () => {
    Swal.fire({
      title: '¿Cerrar sesión?',
      text: '¿Estás seguro de que deseas salir de tu cuenta?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#6741BE',
      cancelButtonColor: '#999',
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        setUser(null)
        Swal.fire({
          title: 'Sesión cerrada',
          text: 'Hasta pronto.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        })
      }
    })
  }

  const updateUser = (updatedData) => {
    setUser((prev) => ({
      ...prev,
      ...updatedData
    }))
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        login,
        logout,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider')
  }
  return context
}
