// src/components/products/ProductTable.jsx
import React from 'react'
import { FaEdit, FaTrash, FaMusic } from 'react-icons/fa'

const ProductTable = ({ products = [], onEdit, onDelete }) => {
  const handleImageError = (e) => {
    e.target.onerror = null
    e.target.src = '/assets/images/products/ref_img.jpg'
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Reciente'
    try {
      const d = new Date(dateString)
      if (isNaN(d.getTime())) return dateString
      return d.toLocaleDateString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    } catch {
      return dateString
    }
  }

  if (products.length === 0) {
    return (
      <div className="empty-state">
        <FaMusic />
        <p>No hay beats registrados en la base de datos.</p>
        <p style={{ fontSize: '0.9rem', marginTop: '8px' }}>
          Podés agregar un beat usando el formulario inferior o pulsar "Cargar datos demo".
        </p>
      </div>
    )
  }

  return (
    <div className="table-responsive">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Foto</th>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Fecha de ingreso</th>
            <th>Precio</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            const formattedPrice = `$${Number(product.price || 0).toLocaleString('es-AR')}`
            return (
              <tr key={product.id}>
                <td>
                  <img
                    src={product.image || '/assets/images/products/ref_img.jpg'}
                    alt={product.name}
                    onError={handleImageError}
                  />
                </td>
                <td>
                  <strong>{product.name}</strong>
                  {product.bpm && (
                    <span style={{ display: 'block', fontSize: '0.75rem', color: '#666' }}>
                      {product.bpm} BPM
                    </span>
                  )}
                </td>
                <td>
                  <span className="card-category" style={{ position: 'static', display: 'inline-block' }}>
                    {product.category || 'General'}
                  </span>
                </td>
                <td>{formatDate(product.createdAt)}</td>
                <td className="price-cell">{formattedPrice}</td>
                <td>
                  <div className="action-btns">
                    <button
                      type="button"
                      onClick={() => onEdit(product)}
                      className="btn btn-edit"
                      title="Editar este beat"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    >
                      <FaEdit /> Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(product.id, product.name)}
                      className="btn btn-delete"
                      title="Eliminar este beat"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    >
                      <FaTrash /> Borrar
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default ProductTable
