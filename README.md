# 🎵 BeatShop — E-commerce & Marketplace de Beats

> **Proyecto Integrador — Segunda Entrega: React, React Router y MockAPI**  
> Marketplace digital para productores y artistas musicales independientes.

---

## 🚀 Descripción del Proyecto

**BeatShop** es una plataforma web de comercio electrónico especializada en la venta y licenciamiento de beats instrumentales de alta calidad (Hip Hop, Trap, R&B, Jazz, House, Electronic, Latin).

Esta segunda entrega representa la evolución completa de la maqueta inicial HTML/CSS hacia una aplicación moderna Single Page Application (SPA) desarrollada con **React** y **Vite**, gestionada con **React Router v6**, formularios validados mediante **React Hook Form**, feedback interactivo con **SweetAlert2** y persistencia en una base de datos REST mediante **MockAPI**.

---

## 🛠️ Tecnologías Utilizadas

| Tecnología | Rol en el Proyecto |
|---|---|
| **React 18 (Vite)** | Biblioteca de interfaz de usuario y bundler de alta velocidad |
| **React Router v6** | Enrutamiento del lado del cliente y rutas dinámicas (`useParams`, `useNavigate`) |
| **MockAPI** | Backend simulado con arquitectura REST para recursos `products` y `users` |
| **React Hook Form** | Gestión y validación eficiente de formularios |
| **SweetAlert2** | Modales de confirmación, alertas de éxito y diálogos accesibles |
| **React Icons** | Iconografía moderna para controles multimedia y acciones |
| **CSS Nativo Modular** | Sistema de diseño propio sin frameworks (variables CSS, flexbox, grid, diseño responsive) |

---

## 📦 Pasos para Clonar e Instalar

```bash
# 1. Clonar el repositorio
git clone https://github.com/juan-pousadas-bernardis/BeatShop_1.2

# 2. Ingresar al directorio del proyecto
cd BeatShop

# 3. Instalar las dependencias
npm install

# 4. Configurar las variables de entorno (MockAPI)
cp .env.example .env
# https://6acd3ff6b406cb8ec0c7010e.mockapi.io

# 5. Iniciar el servidor de desarrollo
npm run dev
```

La aplicación quedará disponible en el navegador en `http://localhost:5173`.

---

## ⚙️ Configuración de MockAPI

La aplicación interactúa con dos recursos en [MockAPI](https://mockapi.io - https://6acd3ff6b406cb8ec0c7010e.mockapi.io):

### 1. Recurso `products`
Campos mínimos requeridos:
- `id` (generado por MockAPI)
- `name` (string)
- `price` (number)
- `description` (string)
- `image` (string - URL)
- `category` (string)
- `bpm` (number, opcional)
- `createdAt` (string ISO date)

### 2. Recurso `users`
Campos mínimos requeridos:
- `id` (generado por MockAPI)
- `name` (string)
- `email` (string)
- `password` (string)
- `birthDate` (string)
- `province` (string)
- `createdAt` (string ISO date)

> 💡 **Carga rápida de datos:** Dentro del panel de administración (`/admin-products`), se incluye el botón **"Cargar 8 beats en MockAPI"** que siembra automáticamente los 8 beats originales del proyecto en tu recurso de MockAPI con un solo click.

---

## 🧭 Estructura de Rutas y Navegación

| Ruta | Componente | Descripción |
|---|---|---|
| `/` | `Home.jsx` | Portada con Hero banner, sección informativa, beats destacados con `useEffect` y beneficios. |
| `/products` | `Products.jsx` | Catálogo completo con buscador en tiempo real y filtrado por géneros musicales. |
| `/products/:id` | `ProductDetail.jsx` | Vista de detalle de beat individual parametrizada con `useParams()`. |
| `/register` | `Register.jsx` | Formulario de registro con validaciones estrictas y envío `POST` a `/users`. |
| `/login` | `Login.jsx` | Formulario de inicio de sesión con validación e impresión en `console.log`. |
| `/admin-products` | `AdminProducts.jsx` | Panel administrativo CRUD de productos (Listado, Creación, Edición y Borrado con confirmación). |
| `/admin-users` | `AdminUsers.jsx` | Panel administrativo CRUD de usuarios registrados en MockAPI. |
| `/about` | `About.jsx` | Información institucional sobre BeatShop y perfil del desarrollador. |
| `/contact` | `Contact.jsx` | Formulario de contacto interactivo, mapa embebido e información de contacto. |

---

## 📂 Organización del Proyecto

```
src/
├── assets/
│   └── images/                 # Imágenes y portadas de beats
├── components/
│   ├── layout/
│   │   ├── Navbar.jsx          # Menú de navegación responsive con carrito
│   │   └── Footer.jsx          # Pie de página institucional y redes sociales
│   ├── ui/
│   │   ├── ProductCard.jsx     # Tarjeta reutilizable de beat con acciones
│   │   ├── Button.jsx          # Botón reutilizable con variantes
│   │   └── Loader.jsx          # Animación de carga para peticiones asíncronas
│   └── products/
│       └── ProductTable.jsx    # Tabla administrativa de beats
├── pages/
│   ├── Home.jsx                # Página principal
│   ├── Products.jsx            # Catálogo de beats con filtros
│   ├── ProductDetail.jsx       # Detalle dinámico (:id)
│   ├── Register.jsx            # Formulario de registro conectado a MockAPI
│   ├── Login.jsx               # Formulario de login
│   ├── AdminProducts.jsx       # CRUD completo de productos
│   ├── AdminUsers.jsx          # CRUD completo de usuarios
│   ├── About.jsx               # Acerca de
│   └── Contact.jsx             # Contacto
├── services/
│   ├── products.service.js     # Capa de peticiones HTTP a MockAPI (/products)
│   └── users.service.js        # Capa de peticiones HTTP a MockAPI (/users)
├── styles/                     # Hojas de estilo modulares (CSS nativo con variables)
├── App.jsx                     # Configuración de BrowserRouter y rutas
└── main.jsx                    # Punto de entrada de la aplicación
```

## Usuario

USER: juanmanuelpb2005@gmail.com
PASSWORD: admin123