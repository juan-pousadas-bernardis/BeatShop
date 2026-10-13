// src/pages/Admin.jsx
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  seedMockApiProducts
} from '../services/products.service'
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  seedMockApiUsers
} from '../services/users.service'
import ProductTable from '../components/products/ProductTable'
import Loader from '../components/ui/Loader'
import ImageUploadField from '../components/ui/ImageUploadField'
import Swal from 'sweetalert2'
import {
  FaMusic,
  FaUsers,
  FaPlus,
  FaSave,
  FaTimes,
  FaCloudUploadAlt,
  FaEdit,
  FaTrash,
  FaLock
} from 'react-icons/fa'

const Admin = () => {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  // Pestaña activa: 'beats' o 'users'
  const [activeTab, setActiveTab] = useState('beats')

  // Estado de Productos (Beats)
  const [products, setProducts] = useState([])
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [editingProduct, setEditingProduct] = useState(null)
  const [newProductImg, setNewProductImg] = useState('')
  const [editProductImg, setEditProductImg] = useState('')

  // Estado de Usuarios
  const [users, setUsers] = useState([])
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [editingUser, setEditingUser] = useState(null)
  const [newUserImg, setNewUserImg] = useState('')
  const [editUserImg, setEditUserImg] = useState('')

  // Protección de ruta: Si no está logueado, redirigir al login
  useEffect(() => {
    if (!isAuthenticated) {
      Swal.fire({
        title: 'Acceso Restringido',
        text: 'Debes iniciar sesión con tu cuenta para acceder al panel de administración.',
        icon: 'warning',
        confirmButtonColor: '#6741BE',
        confirmButtonText: 'Ir a Iniciar Sesión'
      }).then(() => {
        navigate('/login')
      })
    }
  }, [isAuthenticated, navigate])

  // Carga de datos
  const loadProductsData = async () => {
    try {
      setLoadingProducts(true)
      const data = await getProducts()
      setProducts(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Error al cargar productos:', err)
    } finally {
      setLoadingProducts(false)
    }
  }

  const loadUsersData = async () => {
    try {
      setLoadingUsers(true)
      const data = await getUsers()
      setUsers(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Error al cargar usuarios:', err)
    } finally {
      setLoadingUsers(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      loadProductsData()
      loadUsersData()
    }
  }, [isAuthenticated])

  if (!isAuthenticated) {
    return (
      <main className="main-container">
        <section className="section-container" style={{ textAlign: 'center', padding: '100px 20px' }}>
          <FaLock style={{ fontSize: '3rem', color: 'var(--color-primary)', marginBottom: '16px' }} />
          <h2>Acceso Restringido</h2>
          <p style={{ margin: '16px 0', color: 'var(--color-text-light)' }}>
            Debes iniciar sesión para ver y gestionar el panel de administración.
          </p>
          <button type="button" className="btn btn-primary" onClick={() => navigate('/login')}>
            Iniciar Sesión
          </button>
        </section>
      </main>
    )
  }

  // ==========================================
  // OPERACIONES DE BEATS
  // ==========================================
  const handleCreateProduct = async (e) => {
    e.preventDefault()
    const form = e.target
    const name = form['prod-name'].value
    const price = form['prod-price'].value
    const bpm = form['prod-bpm'].value
    const category = form['prod-category'].value
    const description = form['prod-description'].value
    const audioUrl = form['prod-audio']?.value || ''

    if (!newProductImg) {
      Swal.fire({
        title: 'Imagen requerida',
        text: 'Por favor subí un archivo o ingresá una URL de portada.',
        icon: 'warning',
        confirmButtonColor: '#6741BE'
      })
      return
    }

    try {
      Swal.fire({ title: 'Creando beat...', didOpen: () => Swal.showLoading(), allowOutsideClick: false })

      await createProduct({
        name,
        price: Number(price),
        bpm: bpm ? Number(bpm) : undefined,
        category,
        description,
        image: newProductImg,
        audioUrl,
        audrioUrl: audioUrl
      })

      Swal.fire({
        title: '¡Beat creado!',
        text: `"${name}" fue guardado exitosamente.`,
        icon: 'success',
        confirmButtonColor: '#6741BE'
      })

      form.reset()
      setNewProductImg('')
      await loadProductsData()
    } catch (err) {
      console.error('Error al crear beat:', err)
      Swal.fire({ title: 'Aviso', text: err.message || 'No se pudo crear el beat.', icon: 'info' })
      await loadProductsData()
    }
  }

  const handleOpenEditProduct = (prod) => {
    setEditingProduct(prod)
    setEditProductImg(prod.image || '')
  }

  const handleSaveEditProduct = async (e) => {
    e.preventDefault()
    if (!editingProduct) return

    const form = e.target
    const name = form['edit-name'].value
    const price = form['edit-price'].value
    const bpm = form['edit-bpm'].value
    const category = form['edit-category'].value
    const description = form['edit-description'].value
    const audioUrl = form['edit-audio']?.value || ''

    try {
      Swal.fire({ title: 'Guardando cambios...', didOpen: () => Swal.showLoading(), allowOutsideClick: false })

      await updateProduct(editingProduct.id, {
        name,
        price: Number(price),
        bpm: bpm ? Number(bpm) : undefined,
        category,
        description,
        image: editProductImg || editingProduct.image,
        audioUrl,
        audrioUrl: audioUrl
      })

      Swal.fire({
        title: '¡Beat actualizado!',
        text: `"${name}" fue modificado correctamente.`,
        icon: 'success',
        confirmButtonColor: '#6741BE'
      })

      setEditingProduct(null)
      await loadProductsData()
    } catch (err) {
      console.error('Error al editar beat:', err)
      Swal.fire({ title: 'Aviso', text: err.message || 'Error al actualizar beat.', icon: 'info' })
      await loadProductsData()
    }
  }

  const handleDeleteProduct = (id, name) => {
    Swal.fire({
      title: '¿Desea eliminar el producto permanentemente?',
      text: `Se borrará "${name}" de la base de datos.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e74c3c',
      cancelButtonColor: '#6741BE',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'No, cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteProduct(id)
          Swal.fire({
            title: '¡Eliminado!',
            text: `"${name}" fue borrado.`,
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
          })
          await loadProductsData()
        } catch (err) {
          Swal.fire({ title: 'Error', text: 'No se pudo eliminar.', icon: 'error' })
        }
      }
    })
  }

  // ==========================================
  // OPERACIONES DE USUARIOS
  // ==========================================
  const handleCreateUser = async (e) => {
    e.preventDefault()
    const form = e.target
    const name = form['user-name'].value.trim()
    const email = form['user-email'].value.trim()
    const password = form['user-pass'].value.trim()
    const province = form['user-prov'].value
    const birthDate = form['user-birth'].value

    if (!name || !email || !password) {
      Swal.fire({
        title: 'Campos requeridos',
        text: 'Por favor completá nombre, email y contraseña.',
        icon: 'warning',
        confirmButtonColor: '#6741BE'
      })
      return
    }

    try {
      Swal.fire({ title: 'Registrando usuario en MockAPI...', didOpen: () => Swal.showLoading(), allowOutsideClick: false })

      await createUser({
        name,
        email,
        password,
        province,
        birthDate,
        image: newUserImg || '/assets/images/user2.png'
      })

      Swal.fire({
        title: '¡Usuario creado!',
        text: `"${name}" fue registrado en MockAPI.`,
        icon: 'success',
        confirmButtonColor: '#6741BE'
      })

      form.reset()
      setNewUserImg('')
      await loadUsersData()
    } catch (err) {
      console.error('Error al crear usuario:', err)
      Swal.fire({
        title: 'Resultado de registro',
        text: err.message || 'Se procesó la creación del usuario.',
        icon: 'info',
        confirmButtonColor: '#6741BE'
      })
      await loadUsersData()
    }
  }

  const handleOpenEditUser = (u) => {
    setEditingUser(u)
    setEditUserImg(u.image || u.avatar || '')
  }

  const handleSaveEditUser = async (e) => {
    e.preventDefault()
    if (!editingUser) return

    const form = e.target
    const name = form['edit-user-name'].value
    const email = form['edit-user-email'].value
    const password = form['edit-user-pass'].value
    const province = form['edit-user-prov'].value
    const birthDate = form['edit-user-birth'].value

    try {
      Swal.fire({ title: 'Guardando usuario...', didOpen: () => Swal.showLoading(), allowOutsideClick: false })

      await updateUser(editingUser.id, {
        name,
        email,
        password,
        province,
        birthDate,
        image: editUserImg || editingUser.image || '/assets/images/user2.png'
      })

      Swal.fire({
        title: '¡Usuario actualizado!',
        text: `Los datos de "${name}" fueron modificados en MockAPI.`,
        icon: 'success',
        confirmButtonColor: '#6741BE'
      })

      setEditingUser(null)
      await loadUsersData()
    } catch (err) {
      console.error('Error al editar usuario:', err)
      Swal.fire({ title: 'Aviso', text: err.message || 'No se pudo actualizar.', icon: 'info' })
      await loadUsersData()
    }
  }

  const handleDeleteUser = (id, name) => {
    Swal.fire({
      title: '¿Desea eliminar el usuario permanentemente?',
      text: `Se borrará a "${name}" de MockAPI.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e74c3c',
      cancelButtonColor: '#6741BE',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'No, cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteUser(id)
          Swal.fire({
            title: '¡Eliminado!',
            text: `Usuario "${name}" borrado.`,
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
          })
          await loadUsersData()
        } catch (err) {
          Swal.fire({ title: 'Error', text: 'No se pudo eliminar.', icon: 'error' })
        }
      }
    })
  }

  return (
    <main className="main-container">
      <section className="section-container admin-section">
        <h2>Panel de Administración</h2>

        {/* Pestañas de selección unificadas */}
        <div className="admin-header-actions" style={{ justifyContent: 'center', marginBottom: '36px' }}>
          <div className="admin-tabs">
            <button
              type="button"
              className={`admin-tab-btn ${activeTab === 'beats' ? 'active' : ''}`}
              onClick={() => setActiveTab('beats')}
            >
              <FaMusic /> Beats ({products.length})
            </button>
            <button
              type="button"
              className={`admin-tab-btn ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              <FaUsers /> Usuarios ({users.length})
            </button>
          </div>
        </div>

        {/* ==================================================== */}
        {/* VISTA 1: ADMINISTRACIÓN DE BEATS                     */}
        {/* ==================================================== */}
        {activeTab === 'beats' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.4rem' }}>Listado de Beats</h3>
              <button
                type="button"
                className="btn-seed"
                onClick={async () => {
                  try {
                    Swal.fire({ title: 'Cargando datos...', didOpen: () => Swal.showLoading() })
                    await seedMockApiProducts()
                    Swal.fire({ title: '¡Listo!', text: '8 beats cargados en MockAPI', icon: 'success' })
                    await loadProductsData()
                  } catch (e) {
                    Swal.fire({ title: 'Info', text: e.message, icon: 'info' })
                  }
                }}
              >
                <FaCloudUploadAlt /> Cargar 8 beats en MockAPI
              </button>
            </div>

            {loadingProducts ? (
              <Loader message="Cargando beats..." />
            ) : (
              <ProductTable
                products={products}
                onEdit={handleOpenEditProduct}
                onDelete={handleDeleteProduct}
              />
            )}

            {/* Formulario Agregar Beat (siempre en modo creación) */}
            <h2 style={{ marginTop: '56px' }}>Agregar Beat</h2>
            <form className="admin-form" onSubmit={handleCreateProduct}>
              <h3>Nuevo beat</h3>

              <div className="form-group">
                <label htmlFor="prod-name">Nombre del beat *</label>
                <input type="text" id="prod-name" name="prod-name" placeholder="Ej: Boombap Classic" required />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="prod-price">Precio ($ ARS) *</label>
                  <input type="number" id="prod-price" name="prod-price" placeholder="85000" required />
                </div>
                <div className="form-group">
                  <label htmlFor="prod-bpm">BPM (Tempo)</label>
                  <input type="number" id="prod-bpm" name="prod-bpm" placeholder="92" />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="prod-category">Género *</label>
                <select id="prod-category" name="prod-category" required>
                  <option value="">Seleccioná un género</option>
                  <option value="Hip Hop">Hip Hop</option>
                  <option value="Trap">Trap</option>
                  <option value="R&B">R&B</option>
                  <option value="Jazz">Jazz</option>
                  <option value="House">House</option>
                  <option value="Electronic">Electronic</option>
                  <option value="Latin">Latin</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="prod-description">Descripción *</label>
                <textarea
                  id="prod-description"
                  name="prod-description"
                  rows="4"
                  placeholder="Descripción del beat..."
                  required
                ></textarea>
              </div>

              {/* Selector de Foto (Archivo o URL) con compresión automática */}
              <ImageUploadField
                label="Portada del beat (Subir archivo o URL) *"
                value={newProductImg}
                onChange={(val) => setNewProductImg(val)}
                shape="square"
              />

              {/* URL del Audio */}
              <div className="form-group">
                <label htmlFor="prod-audio">URL del Audio (audioUrl / mp3 / wav)</label>
                <input
                  type="url"
                  id="prod-audio"
                  name="prod-audio"
                  placeholder="https://ejemplo.com/audio.mp3"
                />
              </div>

              <button type="submit" className="submit-btn">
                <FaPlus style={{ marginRight: '6px' }} /> Guardar beat
              </button>
            </form>
          </div>
        )}

        {/* ==================================================== */}
        {/* VISTA 2: ADMINISTRACIÓN DE USUARIOS                   */}
        {/* ==================================================== */}
        {activeTab === 'users' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.4rem' }}>Listado de Usuarios</h3>
              <button
                type="button"
                className="btn-seed"
                onClick={async () => {
                  try {
                    Swal.fire({ title: 'Cargando usuarios...', didOpen: () => Swal.showLoading() })
                    await seedMockApiUsers()
                    Swal.fire({ title: '¡Listo!', text: 'Usuarios demo cargados', icon: 'success' })
                    await loadUsersData()
                  } catch (e) {
                    Swal.fire({ title: 'Info', text: e.message, icon: 'info' })
                  }
                }}
              >
                <FaCloudUploadAlt /> Cargar usuarios demo
              </button>
            </div>

            {loadingUsers ? (
              <Loader message="Cargando usuarios..." />
            ) : (
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Avatar</th>
                      <th>Nombre</th>
                      <th>Email</th>
                      <th>Provincia</th>
                      <th>Nacimiento</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan="6" style={{ textAlign: 'center', padding: '24px' }}>
                          No hay usuarios registrados.
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
                                alt={u.name}
                                className="nav-avatar-circular"
                                style={{ width: '40px', height: '40px' }}
                                onError={(e) => {
                                  e.target.onerror = null
                                  e.target.src = '/assets/images/user2.png'
                                }}
                              />
                            </td>
                            <td><strong>{u.name || u.fullname}</strong></td>
                            <td>{u.email}</td>
                            <td>{u.province || 'N/A'}</td>
                            <td>{u.birthDate || u.birthdate || 'N/A'}</td>
                            <td>
                              <div className="action-btns">
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditUser(u)}
                                  className="btn btn-edit"
                                  style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                                >
                                  <FaEdit /> Editar
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteUser(u.id, u.name || u.fullname)}
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

            {/* Formulario Crear Usuario */}
            <h2 style={{ marginTop: '56px' }}>Crear Usuario</h2>
            <form className="admin-form" onSubmit={handleCreateUser}>
              <h3>Nuevo usuario</h3>

              <div className="form-group">
                <label htmlFor="user-name">Nombre completo *</label>
                <input type="text" id="user-name" name="user-name" placeholder="Juan Pérez" required />
              </div>

              {/* Selector de Foto de Perfil */}
              <ImageUploadField
                label="Foto de perfil (Subir archivo o URL)"
                value={newUserImg}
                onChange={(val) => setNewUserImg(val)}
                shape="circle"
              />

              <div className="form-group">
                <label htmlFor="user-email">Correo electrónico *</label>
                <input type="email" id="user-email" name="user-email" placeholder="tu@email.com" required />
              </div>

              <div className="form-group">
                <label htmlFor="user-pass">Contraseña *</label>
                <input type="password" id="user-pass" name="user-pass" placeholder="Mínimo 6 caracteres" required />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="user-birth">Fecha de nacimiento</label>
                  <input type="date" id="user-birth" name="user-birth" />
                </div>
                <div className="form-group">
                  <label htmlFor="user-prov">Provincia</label>
                  <select id="user-prov" name="user-prov">
                    <option value="">Seleccionar</option>
                    <option value="buenos-aires">Buenos Aires</option>
                    <option value="caba">CABA</option>
                    <option value="cordoba">Córdoba</option>
                    <option value="santa-fe">Santa Fe</option>
                    <option value="mendoza">Mendoza</option>
                    <option value="tucuman">Tucumán</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="submit-btn">
                <FaPlus style={{ marginRight: '6px' }} /> Crear usuario
              </button>
            </form>
          </div>
        )}

        {/* ==================================================== */}
        {/* MODAL EMERGENTE DE EDICIÓN DE BEAT                   */}
        {/* ==================================================== */}
        {editingProduct && (
          <div className="modal-overlay" style={{ display: 'flex' }} onClick={() => setEditingProduct(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                className="modal-close"
                onClick={() => setEditingProduct(null)}
                aria-label="Cerrar modal"
              >
                ✕
              </button>

              <h3>Editar Beat</h3>

              <form className="admin-form modal-form" onSubmit={handleSaveEditProduct}>
                <div className="form-group">
                  <label htmlFor="edit-name">Nombre del beat</label>
                  <input
                    type="text"
                    id="edit-name"
                    name="edit-name"
                    defaultValue={editingProduct.name}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="edit-price">Precio ($ ARS)</label>
                    <input
                      type="number"
                      id="edit-price"
                      name="edit-price"
                      defaultValue={editingProduct.price}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="edit-bpm">BPM</label>
                    <input
                      type="number"
                      id="edit-bpm"
                      name="edit-bpm"
                      defaultValue={editingProduct.bpm || ''}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="edit-category">Género</label>
                  <select
                    id="edit-category"
                    name="edit-category"
                    defaultValue={editingProduct.category || 'Hip Hop'}
                  >
                    <option value="Hip Hop">Hip Hop</option>
                    <option value="Trap">Trap</option>
                    <option value="R&B">R&B</option>
                    <option value="Jazz">Jazz</option>
                    <option value="House">House</option>
                    <option value="Electronic">Electronic</option>
                    <option value="Latin">Latin</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="edit-description">Descripción</label>
                  <textarea
                    id="edit-description"
                    name="edit-description"
                    rows="3"
                    defaultValue={editingProduct.description}
                    required
                  ></textarea>
                </div>

                {/* Foto en el modal */}
                <ImageUploadField
                  label="Portada (Subir archivo o URL)"
                  value={editProductImg}
                  onChange={(val) => setEditProductImg(val)}
                  shape="square"
                />

                {/* URL del Audio en el modal */}
                <div className="form-group">
                  <label htmlFor="edit-audio">URL del Audio (audioUrl / audrioUrl)</label>
                  <input
                    type="url"
                    id="edit-audio"
                    name="edit-audio"
                    defaultValue={editingProduct.audioUrl || editingProduct.audrioUrl || ''}
                    placeholder="https://ejemplo.com/beat.mp3"
                  />
                </div>

                <div className="modal-actions">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  >
                    <FaSave /> Guardar cambios
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setEditingProduct(null)}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* MODAL EMERGENTE DE EDICIÓN DE USUARIO                */}
        {/* ==================================================== */}
        {editingUser && (
          <div className="modal-overlay" style={{ display: 'flex' }} onClick={() => setEditingUser(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                className="modal-close"
                onClick={() => setEditingUser(null)}
                aria-label="Cerrar modal"
              >
                ✕
              </button>

              <h3>Editar Usuario</h3>

              <form className="admin-form modal-form" onSubmit={handleSaveEditUser}>
                <div className="form-group">
                  <label htmlFor="edit-user-name">Nombre completo</label>
                  <input
                    type="text"
                    id="edit-user-name"
                    name="edit-user-name"
                    defaultValue={editingUser.name || editingUser.fullname}
                    required
                  />
                </div>

                <ImageUploadField
                  label="Foto de perfil (Subir archivo o URL)"
                  value={editUserImg}
                  onChange={(val) => setEditUserImg(val)}
                  shape="circle"
                />

                <div className="form-group">
                  <label htmlFor="edit-user-email">Correo electrónico</label>
                  <input
                    type="email"
                    id="edit-user-email"
                    name="edit-user-email"
                    defaultValue={editingUser.email}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="edit-user-pass">Contraseña</label>
                  <input
                    type="password"
                    id="edit-user-pass"
                    name="edit-user-pass"
                    defaultValue={editingUser.password}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="edit-user-birth">Fecha de nacimiento</label>
                    <input
                      type="date"
                      id="edit-user-birth"
                      name="edit-user-birth"
                      defaultValue={editingUser.birthDate || editingUser.birthdate || ''}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="edit-user-prov">Provincia</label>
                    <select
                      id="edit-user-prov"
                      name="edit-user-prov"
                      defaultValue={editingUser.province || ''}
                    >
                      <option value="">Seleccionar</option>
                      <option value="buenos-aires">Buenos Aires</option>
                      <option value="caba">CABA</option>
                      <option value="cordoba">Córdoba</option>
                      <option value="santa-fe">Santa Fe</option>
                      <option value="mendoza">Mendoza</option>
                      <option value="tucuman">Tucumán</option>
                    </select>
                  </div>
                </div>

                <div className="modal-actions">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  >
                    <FaSave /> Guardar cambios
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setEditingUser(null)}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </section>
    </main>
  )
}

export default Admin
