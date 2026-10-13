// src/pages/Register.jsx
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { createUser } from '../services/users.service'
import { useAuth } from '../context/AuthContext'
import ImageUploadField from '../components/ui/ImageUploadField'
import Swal from 'sweetalert2'

const Register = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [userAvatar, setUserAvatar] = useState('')

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    mode: 'onTouched'
  })

  const passwordValue = watch('password')

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      Swal.fire({
        title: 'Creando cuenta en MockAPI...',
        text: 'Por favor aguarda un instante.',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading()
        }
      })

      const avatarFinal = userAvatar || '/assets/images/user2.png'

      const newUser = await createUser({
        name: data.fullname,
        email: data.email,
        password: data.password,
        birthdate: data.birthdate,
        province: data.province,
        notes: data.notes || '',
        image: avatarFinal,
        avatar: avatarFinal
      })

      // Iniciar sesión automáticamente con la foto circular cargada
      login({
        id: newUser.id,
        name: data.fullname,
        email: data.email,
        image: avatarFinal,
        avatar: avatarFinal,
        province: data.province
      })

      Swal.fire({
        title: '¡Cuenta creada!',
        text: `Bienvenido/a a BeatShop, ${data.fullname}. Tu perfil y foto fueron sincronizados con MockAPI.`,
        icon: 'success',
        confirmButtonColor: '#6741BE',
        confirmButtonText: 'Ir al inicio'
      }).then(() => {
        navigate('/')
      })
    } catch (error) {
      console.error('Error al registrar usuario:', error)
      Swal.fire({
        title: 'Registro procesado',
        text: error.message || 'Tu usuario fue registrado en la aplicación.',
        icon: 'info',
        confirmButtonColor: '#6741BE'
      }).then(() => {
        navigate('/')
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="main-container">
      <section className="register-section section-container">
        <form className="register-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <h2>Crear cuenta</h2>

          {/* Nombre Completo */}
          <div className="form-group">
            <label htmlFor="fullname">Nombre completo *</label>
            <input
              type="text"
              id="fullname"
              placeholder="Ej: Juan Pérez"
              className={errors.fullname ? 'has-error' : ''}
              {...register('fullname', {
                required: 'El nombre completo es obligatorio',
                minLength: {
                  value: 3,
                  message: 'El nombre debe tener al menos 3 caracteres'
                }
              })}
            />
            {errors.fullname && (
              <span className="form-error">{errors.fullname.message}</span>
            )}
          </div>

          {/* Selector de Foto / Avatar del usuario con compresión automática */}
          <ImageUploadField
            label="Foto de perfil (Subir archivo o URL)"
            value={userAvatar}
            onChange={(val) => setUserAvatar(val)}
            shape="circle"
          />

          {/* Correo Electrónico */}
          <div className="form-group">
            <label htmlFor="email">Correo electrónico *</label>
            <input
              type="email"
              id="email"
              placeholder="tu@email.com"
              className={errors.email ? 'has-error' : ''}
              {...register('email', {
                required: 'El correo electrónico es obligatorio',
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: 'Por favor, ingresá un correo electrónico válido'
                }
              })}
            />
            {errors.email && <span className="form-error">{errors.email.message}</span>}
          </div>

          {/* Contraseña */}
          <div className="form-group">
            <label htmlFor="password">Contraseña *</label>
            <input
              type="password"
              id="password"
              placeholder="Mínimo 6 caracteres"
              className={errors.password ? 'has-error' : ''}
              {...register('password', {
                required: 'La contraseña es obligatoria',
                minLength: {
                  value: 6,
                  message: 'La contraseña debe tener al menos 6 caracteres'
                }
              })}
            />
            {errors.password && (
              <span className="form-error">{errors.password.message}</span>
            )}
          </div>

          {/* Repetir Contraseña */}
          <div className="form-group">
            <label htmlFor="confirmPassword">Repetir contraseña *</label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Repetí tu contraseña"
              className={errors.confirmPassword ? 'has-error' : ''}
              {...register('confirmPassword', {
                required: 'Debes confirmar la contraseña',
                validate: (value) =>
                  value === passwordValue || 'Las contraseñas no coinciden'
              })}
            />
            {errors.confirmPassword && (
              <span className="form-error">{errors.confirmPassword.message}</span>
            )}
          </div>

          {/* Fecha de Nacimiento */}
          <div className="form-group">
            <label htmlFor="birthdate">Fecha de nacimiento *</label>
            <input
              type="date"
              id="birthdate"
              className={errors.birthdate ? 'has-error' : ''}
              {...register('birthdate', {
                required: 'La fecha de nacimiento es obligatoria'
              })}
            />
            {errors.birthdate && (
              <span className="form-error">{errors.birthdate.message}</span>
            )}
          </div>

          {/* Provincia o país */}
          <div className="form-group">
            <label htmlFor="province">Provincia o país *</label>
            <select
              id="province"
              className={errors.province ? 'has-error' : ''}
              {...register('province', {
                required: 'Por favor seleccioná una provincia'
              })}
            >
              <option value="">Seleccioná una provincia</option>
              <option value="buenos-aires">Buenos Aires</option>
              <option value="caba">CABA</option>
              <option value="cordoba">Córdoba</option>
              <option value="santa-fe">Santa Fe</option>
              <option value="mendoza">Mendoza</option>
              <option value="tucuman">Tucumán</option>
              <option value="entre-rios">Entre Ríos</option>
              <option value="salta">Salta</option>
              <option value="misiones">Misiones</option>
            </select>
            {errors.province && (
              <span className="form-error">{errors.province.message}</span>
            )}
          </div>

          {/* Observación (opcional) */}
          <div className="form-group">
            <label htmlFor="notes">Observación (opcional)</label>
            <textarea
              id="notes"
              placeholder="Algún comentario o preferencia musical..."
              {...register('notes')}
            ></textarea>
          </div>

          <button
            type="submit"
            className="submit-btn"
            disabled={isSubmitting}
            style={{ opacity: isSubmitting ? 0.7 : 1 }}
          >
            {isSubmitting ? 'Registrando en MockAPI...' : 'Crear cuenta'}
          </button>

          <Link to="/login" className="true-account">
            ¿Ya tenés cuenta? Iniciar Sesión
          </Link>
        </form>
      </section>
    </main>
  )
}

export default Register
