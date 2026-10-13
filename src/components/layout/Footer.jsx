// src/components/layout/Footer.jsx
import React from 'react'
import { Link } from 'react-router-dom'
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa'

const Footer = () => {
  return (
    <footer className="main-footer">
      <div className="footer-content">
        <div className="footer-column">
          <Link to="/" className="footer-logo">
            <span>Beat</span>Shop
          </Link>
          <p>
            Tu tienda de beats de confianza. Producciones originales, la mejor calidad y descarga inmediata.
          </p>
        </div>

        <div className="footer-column">
          <h3>Seguinos</h3>
          <p>Conectate con nosotros en redes sociales para estar al tanto de las últimas novedades y ofertas.</p>
          <div className="footer-social">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" title="Facebook">
              <FaFacebook />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" title="Twitter">
              <FaTwitter />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" title="LinkedIn">
              <FaLinkedin />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" title="Instagram">
              <FaInstagram />
            </a>
          </div>
        </div>

        <div className="footer-column">
          <h3>Contacto</h3>
          <p>Email: info@beatshop.com</p>
          <p>Tel: (+54) 011 5899-6827</p>
          <p>Dir: Gral. Alvarado 73, Ramos Mejía</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} BeatShop. Todos los derechos reservados.</p>
      </div>
    </footer>
  )
}

export default Footer
