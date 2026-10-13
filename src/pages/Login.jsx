// src/pages/Login.jsx
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getUsers } from '../services/users.service'
import Swal from 'sweetalert2'
import { FaUserCheck, FaSignOutAlt, FaHome, FaSignInAlt } from 'react-icons/fa'

const Login = () => {
  const navigate = useNavigate()
  const { user, isAuthenticated, login, logout } = useAuth()
  const [loadingLogin, setLoadingLogin] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    mode: 'onTouched'
  })

  // Si ya está logueado, respetamos la sesión activa
  if (isAuthenticated && user) {
    const avatarImg = user.image || user.avatar || '/assets/images/user2.png'
    return (
      <main className="main-container">
        <section className="register-section section-container">
          <div className="register-form active-session-card" style={{ textAlign: 'center' }}>
            <div className="active-user-avatar-wrap">
              <img
                src={avatarImg}
                alt={user.name}
                className="nav-avatar-circular large"
                onError={(e) => {
                  e.target.onerror = null
                  e.target.src = '/assets/images/user2.png'
                }}
              />
            </div>

            <h2>Sesión Activa</h2>
            <p style={{ margin: '12px 0 6px 0', fontSize: '1.1rem', color: 'var(--color-text)' }}>
              Hola, <strong>{user.name || user.fullname}</strong>
            </p>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>
              {user.email}
            </p>

            <div className="session-alert-box">
              <FaUserCheck style={{ color: '#27ae60', fontSize: '1.2rem' }} />
              <span>Ya estás autenticado en BeatShop. No es necesario volver a iniciar sesión.</span>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <Link to="/" className="btn btn-primary" style={{ flex: 1 }}>
                <FaHome style={{ marginRight: '6px' }} /> Ir al inicio
              </Link>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={logout}
                style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              >
                <FaSignOutAlt /> Cerrar sesión
              </button>
            </div>
          </div>
        </section>
      </main>
    )
  }

  const onSubmit = async (data) => {
    setLoadingLogin(true)
    try {
      // Requerimiento de la entrega: console.log de los datos de login
      console.log('--- INTENTO DE INICIO DE SESIÓN ---')
      console.log('Email ingresado:', data.email)
      console.log('Password ingresada:', data.password)

      // Obtenemos los usuarios reales desde MockAPI / servicio
      const registeredUsers = await getUsers()
      const enteredEmail = data.email.trim().toLowerCase()
      const enteredPassword = data.password.trim()

      const foundUser = Array.isArray(registeredUsers)
        ? registeredUsers.find(
            (u) => u.email && u.email.trim().toLowerCase() === enteredEmail
          )
        : null

      // Validación 1: El usuario debe existir
      if (!foundUser) {
        Swal.fire({
          title: 'Usuario no encontrado',
          text: `No existe ninguna cuenta registrada con el correo "${data.email}". Verificá los datos o registrate.`,
          icon: 'error',
          confirmButtonColor: '#6741BE'
        })
        return
      }

      // Validación 2: La contraseña debe coincidir exactamente
      if (String(foundUser.password).trim() !== enteredPassword) {
        Swal.fire({
          title: 'Contraseña incorrecta',
          text: 'La contraseña ingresada no coincide con nuestros registros.',
          icon: 'error',
          confirmButtonColor: '#6741BE'
        })
        return
      }

      // Login exitoso: extraemos su foto (campo "image" de MockAPI)
      const userPhoto = foundUser.image || foundUser.avatar || '/assets/images/user2.png'

      const userSession = {
        id: foundUser.id,
        name: foundUser.name || foundUser.fullname || 'Usuario',
        email: foundUser.email,
        image: userPhoto,
        avatar: userPhoto,
        province: foundUser.province || '',
        birthDate: foundUser.birthDate || foundUser.birthdate || ''
      }

      login(userSession)

      Swal.fire({
        title: '¡Bienvenido/a!',
        text: `Hola, ${userSession.name}. Sesión iniciada con éxito.`,
        icon: 'success',
        confirmButtonColor: '#6741BE',
        timer: 1500,
        showConfirmButton: false
      }).then(() => {
        navigate('/')
      })
    } catch (err) {
      console.error('Error durante el inicio de sesión:', err)
      Swal.fire({
        title: 'Error de conexión',
        text: 'Ocurrió un problema al comunicarse con MockAPI. Inténtalo nuevamente.',
        icon: 'error',
        confirmButtonColor: '#6741BE'
      })
    } finally {
      setLoadingLogin(false)
    }
  }

  return (
    <main className="main-container">
      <section className="register-section section-container">
        <form className="register-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <h2>Iniciar Sesión</h2>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">Correo electrónico</label>
            <input
              type="email"
              id="email"
              placeholder="tu@email.com"
              className={errors.email ? 'has-error' : ''}
              {...register('email', {
                required: 'El correo electrónico es requerido',
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: 'Formato de correo no válido'
                }
              })}
            />
            {errors.email && <span className="form-error">{errors.email.message}</span>}
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              placeholder="Tu contraseña"
              className={errors.password ? 'has-error' : ''}
              {...register('password', {
                required: 'La contraseña es requerida'
              })}
            />
            {errors.password && <span className="form-error">{errors.password.message}</span>}
          </div>

          <button
            type="submit"
            className="submit-btn"
            disabled={loadingLogin}
            style={{
              opacity: loadingLogin ? 0.7 : 1,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <FaSignInAlt />
            {loadingLogin ? 'Verificando credenciales...' : 'Iniciar Sesión'}
          </button>

          <Link to="/register" className="false-account">
            ¿No tenés cuenta? Creá una acá
          </Link>
        </form>
      </section>
    </main>
  )
}

export default Login
