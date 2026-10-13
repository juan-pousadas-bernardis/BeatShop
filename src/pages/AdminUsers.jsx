// src/pages/AdminUsers.jsx
import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  seedMockApiUsers,
  isMockApiConfigured
} from '../services/users.service'
import Loader from '../components/ui/Loader'
import ImageUploadField from '../components/ui/ImageUploadField'
import Swal from 'sweetalert2'
import {
  FaUsers,
  FaMusic,
  FaUserPlus,
  FaEdit,
  FaTrash,
  FaSave,
  FaTimes,
  FaCloudUploadAlt
} from 'react-icons/fa'

const AdminUsers = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState(null)
  const [userAvatar, setUserAvatar] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const formRef = useRef(null)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm()

  const loadUsers = async () => {
    try {
      setLoading(true)
      const data = await getUsers()
      setUsers(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error al cargar usuarios:', error)
      Swal.fire({
        title: 'Error de carga',
        text: 'No se pudieron obtener los usuarios desde MockAPI.',
        icon: 'error',
        confirmButtonColor: '#6741BE'
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  useEffect(() => {
    if (selectedUser) {
      setValue('name', selectedUser.name || selectedUser.fullname || '')
      setValue('email', selectedUser.email || '')
      setValue('password', selectedUser.password || '')
      setValue('birthDate', selectedUser.birthDate || selectedUser.birthdate || '')
      setValue('province', selectedUser.province || '')
      setUserAvatar(selectedUser.image || selectedUser.avatar || '')

      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: 'smooth' })
      }
    } else {
      reset({
        name: '',
        email: '',
        password: '',
        birthDate: '',
        province: ''
      })
      setUserAvatar('')
    }
  }, [selectedUser, setValue, reset])

  const handleCancelEdit = () => {
    setSelectedUser(null)
    setUserAvatar('')
  }

  const onSubmit = async (formData) => {
    setSubmitting(true)
    try {
      const avatarFinal = userAvatar || '/assets/images/user2.png'

      if (selectedUser) {
        // PUT /users/:id
        await updateUser(selectedUser.id, {
          ...formData,
          image: avatarFinal,
          avatar: avatarFinal
        })
        Swal.fire({
          title: '¡Usuario actualizado!',
          text: `"${formData.name}" fue actualizado con éxito.`,
          icon: 'success',
          confirmButtonColor: '#6741BE'
        })
        setSelectedUser(null)
      } else {
        // POST /users
        await createUser({
          ...formData,
          image: avatarFinal,
          avatar: avatarFinal,
          createdAt: new Date().toISOString()
        })
        Swal.fire({
          title: '¡Usuario registrado!',
          text: `"${formData.name}" fue agregado a MockAPI.`,
          icon: 'success',
          confirmButtonColor: '#6741BE'
        })
      }

      reset()
      setUserAvatar('')
      await loadUsers()
    } catch (error) {
      console.error('Error al guardar usuario:', error)
      Swal.fire({
        title: 'Error',
        text: 'Ocurrió un error al procesar la solicitud en MockAPI.',
        icon: 'error',
        confirmButtonColor: '#6741BE'
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = (id, name) => {
    Swal.fire({
      title: '¿Eliminar usuario?',
      text: `Se eliminará a "${name}" de MockAPI.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e74c3c',
      cancelButtonColor: '#6741BE',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteUser(id)
          Swal.fire({
            title: '¡Eliminado!',
            text: `El usuario "${name}" fue removido de MockAPI.`,
            icon: 'success',
            confirmButtonColor: '#6741BE',
            timer: 2000,
            showConfirmButton: false
          })
          if (selectedUser && selectedUser.id === id) {
            setSelectedUser(null)
            setUserAvatar('')
          }
          await loadUsers()
        } catch (error) {
          console.error('Error al eliminar usuario:', error)
          Swal.fire({
            title: 'Error',
            text: 'No se pudo eliminar el usuario.',
            icon: 'error',
            confirmButtonColor: '#6741BE'
          })
        }
      }
    })
  }

  const handleSeedUsers = async () => {
    const isConfirmed = await Swal.fire({
      title: 'Cargar usuarios de prueba',
      text: 'Se subirán usuarios de ejemplo a tu recurso "users" en MockAPI.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#27ae60',
      cancelButtonColor: '#6741BE',
      confirmButtonText: 'Sí, cargar usuarios',
      cancelButtonText: 'Cancelar'
    })

    if (isConfirmed.isConfirmed) {
      try {
        Swal.fire({
          title: 'Subiendo usuarios...',
          didOpen: () => Swal.showLoading()
        })
        await seedMockApiUsers()
        Swal.fire({
          title: '¡Listo!',
          text: 'Usuarios de prueba cargados con éxito.',
          icon: 'success',
          confirmButtonColor: '#6741BE'
        })
        await loadUsers()
      } catch (err) {
        Swal.fire({
          title: 'Atención',
          text: err.message || 'Error al conectar con MockAPI',
          icon: 'info',
          confirmButtonColor: '#6741BE'
        })
      }
    }
  }

  return (
    <main className="main-container">
      <section className="section-container admin-section">
        <h2>Panel de Administración de Usuarios</h2>

        {/* Acciones y Pestañas */}
        <div className="admin-header-actions">
          <div className="admin-tabs">
            <Link to="/admin-products" className="admin-tab-btn">
              <FaMusic /> Beats
            </Link>
            <Link to="/admin-users" className="admin-tab-btn active">
              <FaUsers /> Usuarios ({users.length})
            </Link>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {isMockApiConfigured() ? (
              <span className="api-badge connected">
                <span className="api-badge-dot"></span> MockAPI Activo
              </span>
            ) : (
              <span className="api-badge fallback">
                <span className="api-badge-dot"></span> Modo Local
              </span>
            )}

            <button
              type="button"
              onClick={handleSeedUsers}
              className="btn-seed"
              title="Cargar usuarios de prueba en MockAPI"
            >
              <FaCloudUploadAlt /> Cargar usuarios demo
            </button>
          </div>
        </div>

        {/* Tabla de Usuarios */}
        {loading ? (
          <Loader message="Cargando usuarios desde MockAPI..." />
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Avatar</th>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Provincia / Región</th>
                  <th>Fecha de Nacimiento</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '32px' }}>
                      No hay usuarios registrados aún en MockAPI.
                    </td>
                  </tr>
                ) : (
                  users.map((u) => {
                    const avatarSrc = u.image || u.avatar || '/assets/images/user2.png'
                    return (
                      <tr key={u.id}>
                        <td>
                          <img
                            src={avatarSrc}
                            alt={u.name || u.fullname}
                            className="nav-avatar-circular"
                            style={{ width: '42px', height: '42px', borderRadius: '50%' }}
                            onError={(e) => {
                              e.target.onerror = null
                              e.target.src = '/assets/images/user2.png'
                            }}
                          />
                        </td>
                        <td>
                          <strong>{u.name || u.fullname}</strong>
                        </td>
                        <td>{u.email}</td>
                        <td>
                          <span className="card-category" style={{ position: 'static' }}>
                            {u.province || 'No especificada'}
                          </span>
                        </td>
                        <td>{u.birthDate || u.birthdate || 'N/A'}</td>
                        <td>
                          <div className="action-btns">
                            <button
                              type="button"
                              onClick={() => setSelectedUser(u)}
                              className="btn btn-edit"
                              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                            >
                              <FaEdit /> Editar
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(u.id, u.name || u.fullname)}
                              className="btn btn-delete"
                              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                            >
                              <FaTrash /> Borrar
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Formulario de Crear / Editar Usuario */}
        <div ref={formRef} style={{ marginTop: '48px' }}>
          <h2>{selectedUser ? 'Editar Usuario' : 'Crear Usuario'}</h2>

          {selectedUser && (
            <div className="edit-mode-banner" style={{ maxWidth: '650px', margin: '0 auto 24px auto' }}>
              <span>Editando a: "{selectedUser.name || selectedUser.fullname}"</span>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="btn btn-secondary"
                style={{ padding: '4px 12px', fontSize: '0.8rem' }}
              >
                <FaTimes /> Cancelar edición
              </button>
            </div>
          )}

          <form className="admin-form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <h3>{selectedUser ? 'Modificar datos' : 'Nuevo usuario'}</h3>

            <div className="form-group">
              <label htmlFor="user-name">Nombre completo *</label>
              <input
                type="text"
                id="user-name"
                placeholder="Ej: Juan Pérez"
                className={errors.name ? 'has-error' : ''}
                {...register('name', { required: 'El nombre es requerido' })}
              />
              {errors.name && <span className="form-error">{errors.name.message}</span>}
            </div>

            {/* Campo dual de Foto de Perfil */}
            <ImageUploadField
              label="Foto de perfil (Subir archivo o Enlace URL)"
              value={userAvatar}
              onChange={(val) => setUserAvatar(val)}
              shape="circle"
            />

            <div className="form-group">
              <label htmlFor="user-email">Correo electrónico *</label>
              <input
                type="email"
                id="user-email"
                placeholder="tu@email.com"
                className={errors.email ? 'has-error' : ''}
                {...register('email', {
                  required: 'El correo es requerido',
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: 'Correo no válido'
                  }
                })}
              />
              {errors.email && <span className="form-error">{errors.email.message}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="user-password">Contraseña *</label>
              <input
                type="password"
                id="user-password"
                placeholder="Mínimo 6 caracteres"
                className={errors.password ? 'has-error' : ''}
                {...register('password', {
                  required: 'La contraseña es requerida',
                  minLength: { value: 6, message: 'Mínimo 6 caracteres' }
                })}
              />
              {errors.password && <span className="form-error">{errors.password.message}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="user-birth">Fecha de nacimiento *</label>
                <input
                  type="date"
                  id="user-birth"
                  className={errors.birthDate ? 'has-error' : ''}
                  {...register('birthDate', { required: 'Fecha requerida' })}
                />
                {errors.birthDate && <span className="form-error">{errors.birthDate.message}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="user-prov">Provincia / Región *</label>
                <select
                  id="user-prov"
                  className={errors.province ? 'has-error' : ''}
                  {...register('province', { required: 'Provincia requerida' })}
                >
                  <option value="">Seleccioná provincia</option>
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
                {errors.province && <span className="form-error">{errors.province.message}</span>}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              <button
                type="submit"
                className="submit-btn"
                disabled={submitting}
                style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                {selectedUser ? (
                  <>
                    <FaSave /> {submitting ? 'Guardando en MockAPI...' : 'Guardar cambios'}
                  </>
                ) : (
                  <>
                    <FaUserPlus /> {submitting ? 'Creando en MockAPI...' : 'Crear usuario'}
                  </>
                )}
              </button>

              {selectedUser && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="btn btn-secondary"
                  style={{ padding: '16px 24px', fontSize: '1rem' }}
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>
      </section>
    </main>
  )
}

export default AdminUsers
