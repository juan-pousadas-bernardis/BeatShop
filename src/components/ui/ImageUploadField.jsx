// src/components/ui/ImageUploadField.jsx
import React, { useState, useRef } from 'react'
import { FaCloudUploadAlt, FaLink, FaTimes } from 'react-icons/fa'
import { compressImageFile } from '../../utils/imageCompressor'

const ImageUploadField = ({
  label = 'Foto / Portada',
  value = '',
  onChange,
  error = '',
  shape = 'square' // 'square' para beats, 'circle' para usuarios
}) => {
  const [tab, setTab] = useState('file') // 'file' o 'url'
  const [compressing, setCompressing] = useState(false)
  const fileInputRef = useRef(null)

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Por favor seleccioná un archivo de imagen válido (JPG, PNG, WEBP, etc.)')
        return
      }

      try {
        setCompressing(true)
        // Redimensionar para que MockAPI nunca rechace la petición
        const maxDim = shape === 'circle' ? 160 : 500
        const compressedBase64 = await compressImageFile(file, maxDim, maxDim, 0.8)
        if (onChange) {
          onChange(compressedBase64)
        }
      } catch (err) {
        console.error('Error al procesar la imagen:', err)
        alert('Ocurrió un error al procesar el archivo. Intenta con otra imagen.')
      } finally {
        setCompressing(false)
      }
    }
  }

  const handleUrlChange = (e) => {
    if (onChange) {
      onChange(e.target.value)
    }
  }

  const handleClear = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    if (onChange) {
      onChange('')
    }
  }

  return (
    <div className="form-group image-upload-group">
      <label>{label}</label>

      {/* Selector de modo: Archivo vs URL */}
      <div className="upload-tabs">
        <button
          type="button"
          className={`upload-tab-btn ${tab === 'file' ? 'active' : ''}`}
          onClick={() => setTab('file')}
        >
          <FaCloudUploadAlt /> Subir archivo
        </button>
        <button
          type="button"
          className={`upload-tab-btn ${tab === 'url' ? 'active' : ''}`}
          onClick={() => setTab('url')}
        >
          <FaLink /> Enlace URL
        </button>
      </div>

      {/* Contenido según pestaña */}
      {tab === 'file' ? (
        <div className="file-drop-area">
          <input
            type="file"
            id={`file-input-${label.replace(/\s+/g, '-').toLowerCase()}`}
            ref={fileInputRef}
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <button
            type="button"
            className="choose-file-btn"
            disabled={compressing}
            onClick={() => fileInputRef.current?.click()}
          >
            <FaCloudUploadAlt style={{ fontSize: '1.4rem' }} />
            <span>
              {compressing ? 'Procesando imagen...' : 'Seleccionar imagen desde tu dispositivo'}
            </span>
          </button>
        </div>
      ) : (
        <input
          type="url"
          placeholder="https://ejemplo.com/foto.jpg"
          value={value && !value.startsWith('data:') ? value : ''}
          onChange={handleUrlChange}
          className={error ? 'has-error' : ''}
        />
      )}

      {/* Previsualización de la foto seleccionada */}
      {value && (
        <div className="image-preview-box">
          <div className="preview-header">
            <span>Vista previa:</span>
            <button
              type="button"
              className="preview-remove-btn"
              onClick={handleClear}
              title="Quitar foto"
            >
              <FaTimes /> Quitar
            </button>
          </div>
          <div className={`preview-wrapper ${shape === 'circle' ? 'circle-preview' : ''}`}>
            <img
              src={value}
              alt="Previsualización"
              onError={(e) => {
                e.target.onerror = null
                e.target.src = '/assets/images/user2.png'
              }}
            />
          </div>
        </div>
      )}

      {error && <span className="form-error">{error}</span>}
    </div>
  )
}

export default ImageUploadField
