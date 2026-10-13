// src/components/profile/ProfileModal.jsx
import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { updateUser as updateApiUser } from '../../services/users.service'
import ImageUploadField from '../ui/ImageUploadField'
import Swal from 'sweetalert2'
import { FaSave, FaTimes, FaUserCircle } from 'react-icons/fa'

const ProfileModal = ({ isOpen, onClose }) => {
  const { user, updateUser } = useAuth()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [province, setProvince] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [userImage, setUserImage] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (user) {
      setName(user.name || user.fullname || '')
      setEmail(user.email || '')
      setPassword(user.password || '')
      setProvince(user.province || '')
      setBirthDate(user.birthDate || user.birthdate || '')
      setUserImage(user.image || user.avatar || '')
    }
  }, [user, isOpen])

  if (!isOpen || !user) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) {
      Swal.fire({
        title: 'Nombre requerido',
        text: 'Por favor ingresá tu nombre completo.',
        icon: 'warning',
        confirmButtonColor: '#6741BE'
      })
      return
    }

    setSaving(true)
    try {
      const updatedPayload = {
        name,
        email,
        password,
        province,
        birthDate,
        image: userImage || user.image || '/assets/images/user2.png',
        avatar: userImage || user.image || '/assets/images/user2.png'
      }

      // 1. Guardar en MockAPI si tiene ID
      if (user.id) {
        await updateApiUser(user.id, updatedPayload)
      }

      // 2. Actualizar sesión activa
      updateUser(updatedPayload)

      Swal.fire({
        title: '¡Perfil actualizado!',
        text: 'Los cambios y tu foto de perfil se guardaron correctamente.',
        icon: 'success',
        confirmButtonColor: '#6741BE',
        timer: 1800,
        showConfirmButton: false
      })

      onClose()
    } catch (err) {
      console.error('Error al actualizar perfil:', err)
      Swal.fire({
        title: 'Error',
        text: 'No se pudo guardar la información en MockAPI.',
        icon: 'error',
        confirmButtonColor: '#6741BE'
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="modal-overlay" style={{ display: 'flex' }} onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="modal-close"
          onClick={onClose}
          aria-label="Cerrar modal"
        >
          ✕
        </button>

        <h3>
          <FaUserCircle style={{ marginRight: '8px', verticalAlign: 'middle' }} />
          Editar mi Perfil
        </h3>

        <form className="admin-form modal-form" onSubmit={handleSubmit}>
          {/* Campo de Foto de Perfil (Subir archivo o URL) */}
          <ImageUploadField
            label="Foto de perfil (Archivo o URL)"
            value={userImage}
            onChange={(val) => setUserImage(val)}
            shape="circle"
          />

          <div className="form-group">
            <label htmlFor="prof-name">Nombre completo</label>
            <input
              type="text"
              id="prof-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="prof-email">Correo electrónico</label>
            <input
              type="email"
              id="prof-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="prof-pass">Contraseña</label>
            <input
              type="password"
              id="prof-pass"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="prof-birth">Fecha de nacimiento</label>
              <input
                type="date"
                id="prof-birth"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="prof-prov">Provincia</label>
              <select
                id="prof-prov"
                value={province}
                onChange={(e) => setProvince(e.target.value)}
              >
                <option value="">Seleccionar</option>
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
            </div>
          </div>

          <div className="modal-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
              style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
            >
              <FaSave /> {saving ? 'Guardando...' : 'Guardar cambios'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProfileModal
