// src/pages/AdminProducts.jsx
import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  seedMockApiProducts,
  isMockApiConfigured
} from '../services/products.service'
import ProductTable from '../components/products/ProductTable'
import Loader from '../components/ui/Loader'
import ImageUploadField from '../components/ui/ImageUploadField'
import Swal from 'sweetalert2'
import { FaMusic, FaUsers, FaPlus, FaSave, FaTimes, FaCloudUploadAlt } from 'react-icons/fa'

const AdminProducts = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [productImage, setProductImage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const formRef = useRef(null)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm()

  const loadProducts = async () => {
    try {
      setLoading(true)
      const data = await getProducts()
      setProducts(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error al cargar productos en Admin:', error)
      Swal.fire({
        title: 'Error de carga',
        text: 'No se pudieron obtener los beats desde MockAPI.',
        icon: 'error',
        confirmButtonColor: '#6741BE'
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  // Al seleccionar un producto para edición, pre-cargamos el formulario
  useEffect(() => {
    if (selectedProduct) {
      setValue('name', selectedProduct.name || '')
      setValue('price', selectedProduct.price || '')
      setValue('bpm', selectedProduct.bpm || '')
      setValue('category', selectedProduct.category || '')
      setValue('description', selectedProduct.description || '')
      setProductImage(selectedProduct.image || '')

      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: 'smooth' })
      }
    } else {
      reset({
        name: '',
        price: '',
        bpm: '',
        category: '',
        description: ''
      })
      setProductImage('')
    }
  }, [selectedProduct, setValue, reset])

  const handleCancelEdit = () => {
    setSelectedProduct(null)
    setProductImage('')
  }

  // Enviar formulario (Crear o Editar)
  const onSubmit = async (formData) => {
    if (!productImage) {
      Swal.fire({
        title: 'Falta la imagen',
        text: 'Por favor subí un archivo de imagen o ingresá una URL para el beat.',
        icon: 'warning',
        confirmButtonColor: '#6741BE'
      })
      return
    }

    setSubmitting(true)
    try {
      const payload = {
        name: formData.name,
        price: Number(formData.price),
        bpm: formData.bpm ? Number(formData.bpm) : undefined,
        category: formData.category,
        description: formData.description,
        image: productImage
      }

      if (selectedProduct) {
        // MODO EDICIÓN: PUT /products/:id
        await updateProduct(selectedProduct.id, payload)
        Swal.fire({
          title: '¡Beat actualizado!',
          text: `"${payload.name}" fue modificado correctamente en MockAPI.`,
          icon: 'success',
          confirmButtonColor: '#6741BE'
        })
        setSelectedProduct(null)
      } else {
        // MODO CREACIÓN: POST /products
        payload.createdAt = new Date().toISOString()
        await createProduct(payload)
        Swal.fire({
          title: '¡Beat creado!',
          text: `"${payload.name}" fue registrado con éxito en MockAPI.`,
          icon: 'success',
          confirmButtonColor: '#6741BE'
        })
      }

      reset()
      setProductImage('')
      await loadProducts()
    } catch (error) {
      console.error('Error al guardar producto:', error)
      Swal.fire({
        title: 'Error al procesar',
        text: 'Ocurrió un error al comunicarse con MockAPI.',
        icon: 'error',
        confirmButtonColor: '#6741BE'
      })
    } finally {
      setSubmitting(false)
    }
  }

  // Eliminar producto con confirmación previa: DELETE /products/:id
  const handleDelete = (id, name) => {
    Swal.fire({
      title: '¿Desea eliminar el producto permanentemente?',
      text: `Se borrará "${name}" de MockAPI. Esta acción no se puede revertir.`,
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
            text: `El beat "${name}" fue eliminado de MockAPI.`,
            icon: 'success',
            confirmButtonColor: '#6741BE',
            timer: 2000,
            showConfirmButton: false
          })
          if (selectedProduct && selectedProduct.id === id) {
            setSelectedProduct(null)
            setProductImage('')
          }
          await loadProducts()
        } catch (error) {
          console.error('Error al eliminar producto:', error)
          Swal.fire({
            title: 'Error',
            text: 'No se pudo eliminar el beat de MockAPI.',
            icon: 'error',
            confirmButtonColor: '#6741BE'
          })
        }
      }
    })
  }

  // Sembrar 8 beats de muestra en MockAPI
  const handleSeedDemoData = async () => {
    const isConfirmed = await Swal.fire({
      title: 'Cargar 8 Beats de demostración',
      text: 'Se subirán los 8 beats originales del proyecto a tu base de datos de MockAPI.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#27ae60',
      cancelButtonColor: '#6741BE',
      confirmButtonText: 'Sí, cargar ahora',
      cancelButtonText: 'Cancelar'
    })

    if (isConfirmed.isConfirmed) {
      try {
        Swal.fire({
          title: 'Subiendo datos a MockAPI...',
          text: 'Por favor aguarda unos segundos.',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading()
          }
        })
        await seedMockApiProducts()
        Swal.fire({
          title: '¡Carga completa!',
          text: 'Los 8 beats se subieron exitosamente a MockAPI.',
          icon: 'success',
          confirmButtonColor: '#6741BE'
        })
        await loadProducts()
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
        <h2>Panel de Administración</h2>

        {/* Barra superior de pestañas y estado */}
        <div className="admin-header-actions">
          <div className="admin-tabs">
            <Link to="/admin-products" className="admin-tab-btn active">
              <FaMusic /> Beats ({products.length})
            </Link>
            <Link to="/admin-users" className="admin-tab-btn">
              <FaUsers /> Usuarios
            </Link>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {isMockApiConfigured() ? (
              <span className="api-badge connected" title="Conectado a MockAPI">
                <span className="api-badge-dot"></span> MockAPI Activo
              </span>
            ) : (
              <span className="api-badge fallback" title="Configura VITE_MOCKAPI_URL en tu .env">
                <span className="api-badge-dot"></span> Modo Local / Fallback
              </span>
            )}

            <button
              type="button"
              onClick={handleSeedDemoData}
              className="btn-seed"
              title="Cargar los 8 beats originales en MockAPI con 1 click"
            >
              <FaCloudUploadAlt /> Cargar 8 beats en MockAPI
            </button>
          </div>
        </div>

        {/* Tabla de Productos */}
        {loading ? (
          <Loader message="Cargando productos desde MockAPI..." />
        ) : (
          <ProductTable
            products={products}
            onEdit={(prod) => setSelectedProduct(prod)}
            onDelete={handleDelete}
          />
        )}

        {/* Formulario de Creación / Edición */}
        <div ref={formRef} style={{ marginTop: '48px' }}>
          <h2>{selectedProduct ? 'Editar Beat' : 'Agregar Beat'}</h2>

          {selectedProduct && (
            <div className="edit-mode-banner" style={{ maxWidth: '650px', margin: '0 auto 24px auto' }}>
              <span>Modificando: "{selectedProduct.name}"</span>
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
            <h3>{selectedProduct ? 'Editar información' : 'Nuevo beat'}</h3>

            {/* Nombre */}
            <div className="form-group">
              <label htmlFor="prod-name">Nombre del beat *</label>
              <input
                type="text"
                id="prod-name"
                placeholder="Ej: Boombap Classic"
                className={errors.name ? 'has-error' : ''}
                {...register('name', { required: 'El nombre es obligatorio' })}
              />
              {errors.name && <span className="form-error">{errors.name.message}</span>}
            </div>

            {/* Fila: Precio y BPM */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="prod-price">Precio ($ ARS) *</label>
                <input
                  type="number"
                  id="prod-price"
                  placeholder="Ej: 85000"
                  className={errors.price ? 'has-error' : ''}
                  {...register('price', {
                    required: 'El precio es obligatorio',
                    min: { value: 1, message: 'El precio debe ser mayor a 0' }
                  })}
                />
                {errors.price && <span className="form-error">{errors.price.message}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="prod-stock">BPM (Tempo)</label>
                <input
                  type="number"
                  id="prod-stock"
                  placeholder="Ej: 92"
                  {...register('bpm')}
                />
              </div>
            </div>

            {/* Género */}
            <div className="form-group">
              <label htmlFor="prod-category">Género / Categoría *</label>
              <select
                id="prod-category"
                className={errors.category ? 'has-error' : ''}
                {...register('category', { required: 'Debes seleccionar una categoría' })}
              >
                <option value="">Seleccioná un género</option>
                <option value="Hip Hop">Hip Hop</option>
                <option value="Trap">Trap</option>
                <option value="R&B">R&B</option>
                <option value="Jazz">Jazz</option>
                <option value="House">House</option>
                <option value="Electronic">Electronic</option>
                <option value="Latin">Latin</option>
              </select>
              {errors.category && <span className="form-error">{errors.category.message}</span>}
            </div>

            {/* Descripción */}
            <div className="form-group">
              <label htmlFor="prod-description">Descripción *</label>
              <textarea
                id="prod-description"
                rows="4"
                placeholder="Descripción del beat, instrumentos, vibra..."
                className={errors.description ? 'has-error' : ''}
                {...register('description', { required: 'La descripción es obligatoria' })}
              ></textarea>
              {errors.description && <span className="form-error">{errors.description.message}</span>}
            </div>

            {/* Campo dual de Foto (Subir archivo o URL) */}
            <ImageUploadField
              label="Portada del beat (Subir archivo o Enlace URL) *"
              value={productImage}
              onChange={(val) => setProductImage(val)}
              shape="square"
            />

            {/* Botones de acción del formulario */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              <button
                type="submit"
                className="submit-btn"
                disabled={submitting}
                style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                {selectedProduct ? (
                  <>
                    <FaSave /> {submitting ? 'Guardando en MockAPI...' : 'Guardar cambios'}
                  </>
                ) : (
                  <>
                    <FaPlus /> {submitting ? 'Creando en MockAPI...' : 'Guardar beat'}
                  </>
                )}
              </button>

              {selectedProduct && (
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

export default AdminProducts
