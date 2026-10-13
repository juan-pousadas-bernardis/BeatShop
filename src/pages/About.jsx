// src/pages/About.jsx
import React from 'react'

const About = () => {
  return (
    <main className="main-container">
      <section className="section-container">
        <div className="about-section">
          <div className="about-header">
            <h2>Acerca de BeatShop</h2>
            <p>
              Nacimos con la misión de acercar los mejores beats a cada artista argentino,
              combinando calidad profesional con un servicio de excelencia.
            </p>
          </div>

          <div className="about-phrase">
            "La música es el lenguaje universal de la humanidad. Cada beat cuenta una historia, cada ritmo
            despierta una emoción. En BeatShop creemos en el poder del sonido para transformar ideas en arte."
          </div>

          <div className="about-content">
            <div>
              <p>
                BeatShop es un marketplace dedicado a la venta de beats y producciones musicales. Fundado en
                2026, nuestro compromiso es ofrecer beats originales con licencia comercial incluida y los
                precios más competitivos del mercado argentino.
              </p>
              <p>
                Trabajamos con los productores más talentosos del sector y seleccionamos cada beat para
                asegurarnos de que cumpla con los más altos estándares de calidad. Creemos en la música como
                herramienta de transformación y trabajamos cada día para hacerla accesible a todos los artistas.
              </p>
              <p>
                Este proyecto fue desarrollado como parte del <strong>Trabajo Integrador</strong> del curso,
                migrado íntegramente a <strong>React + Vite</strong>, con enrutamiento dinámico mediante{' '}
                <strong>React Router v6</strong> y persistencia en tiempo real en la nube a través de{' '}
                <strong>MockAPI</strong>.
              </p>
            </div>

            <div className="dev-card">
              <img src="/assets/images/user2.png" alt="Foto del desarrollador" />
              <h3>Juan Manuel</h3>
              <p>Desarrollador Full Stack</p>
              <p className="contact-info">jm@beatshop.com</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default About
