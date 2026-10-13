// src/pages/Contact.jsx
import React from 'react'
import { useForm } from 'react-hook-form'
import Swal from 'sweetalert2'
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa'

const Contact = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm()

  const onSubmit = (data) => {
    Swal.fire({
      title: '¡Mensaje Enviado!',
      text: `Gracias por contactarnos, ${data.name}. Nos comunicaremos con vos a la brevedad al correo ${data.email}.`,
      icon: 'success',
      confirmButtonColor: '#6741BE',
      confirmButtonText: 'Genial'
    })
    reset()
  }

  return (
    <main className="main-container">
      <section className="section-container">
        <div className="contact-grid">
          {/* Formulario */}
          <div className="contact-form-wrapper">
            <h2>Contactanos</h2>
            <form className="contact-form" onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="form-group">
                <label htmlFor="contact-name">Nombre completo *</label>
                <input
                  type="text"
                  id="contact-name"
                  placeholder="Tu nombre"
                  className={errors.name ? 'has-error' : ''}
                  {...register('name', { required: 'Por favor ingresá tu nombre' })}
                />
                {errors.name && <span className="form-error">{errors.name.message}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="contact-email">Correo electrónico *</label>
                <input
                  type="email"
                  id="contact-email"
                  placeholder="tu@email.com"
                  className={errors.email ? 'has-error' : ''}
                  {...register('email', {
                    required: 'El correo es obligatorio',
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: 'Correo no válido'
                    }
                  })}
                />
                {errors.email && <span className="form-error">{errors.email.message}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="contact-msg">Mensaje *</label>
                <textarea
                  id="contact-msg"
                  rows="5"
                  placeholder="Escribí tu mensaje (mínimo 20 caracteres)..."
                  className={errors.message ? 'has-error' : ''}
                  {...register('message', {
                    required: 'El mensaje es requerido',
                    minLength: {
                      value: 20,
                      message: 'El mensaje debe tener al menos 20 caracteres'
                    }
                  })}
                ></textarea>
                {errors.message && <span className="form-error">{errors.message.message}</span>}
              </div>

              <button
                type="submit"
                className="submit-btn"
                disabled={isSubmitting}
                style={{ opacity: isSubmitting ? 0.7 : 1 }}
              >
                {isSubmitting ? 'Enviando...' : 'Enviar mensaje'}
              </button>
            </form>
          </div>

          {/* Mapa */}
          <div className="map-wrapper">
            <h2>Nuestra ubicación</h2>
            <div className="map-container">
              <iframe
                title="Ubicación BeatShop"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d52560.28274454353!2d-58.444299!3d-34.603722!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bccb0b3c0c0b0b%3A0x3b2e5b0b0b0b0b0b!2sObelisco!5e0!3m2!1ses!2sar!4v1"
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* Tarjetas informativas de contacto */}
      <section className="section-container">
        <div className="contact-info-section">
          <div className="contact-info-card">
            <span className="icon">
              <FaMapMarkerAlt style={{ color: 'var(--color-primary)' }} />
            </span>
            <h3>Dirección</h3>
            <p>
              Gral. Alvarado 73
              <br />
              Ramos Mejía, Argentina
            </p>
          </div>

          <div className="contact-info-card">
            <span className="icon">
              <FaPhoneAlt style={{ color: 'var(--color-primary)' }} />
            </span>
            <h3>Teléfono</h3>
            <p>
              (+54) 011 5899-6827
              <br />
              Lun a Vie de 9 a 18hs
            </p>
          </div>

          <div className="contact-info-card">
            <span className="icon">
              <FaEnvelope style={{ color: 'var(--color-primary)' }} />
            </span>
            <h3>Email</h3>
            <p>
              info@beatshop.com
              <br />
              ventas@beatshop.com
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Contact
