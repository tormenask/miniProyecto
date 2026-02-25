# 🖥️ miniProyecto — Frontend

Frontend del Proyecto Integrador I, construido con **React**, **Vite** y **TailwindCSS**.

## 📋 Descripción

Aplicación web que consume la API REST del backend para gestionar usuarios y actividades. Incluye las siguientes páginas:

| Ruta | Página | Descripción |
|------|--------|-------------|
| `/login` | Login | Inicio de sesión |
| `/register` | Register | Registro de nuevo usuario |
| `/hoy` | Hoy | Actividades del día (página principal) |
| `/crear` | Crear | Formulario para crear actividades |
| `/actividad/:id` | Actividad | Detalle de una actividad |
| `/progreso` | Progreso | Dashboard de progreso |
| `/home` | Home | Lista de usuarios registrados |

## 🛠️ Tecnologías

- [React 18](https://react.dev/) — Biblioteca de UI
- [Vite 5](https://vitejs.dev/) — Build tool y servidor de desarrollo
- [TailwindCSS 3](https://tailwindcss.com/) — Framework de estilos utilitarios
- [React Router 7](https://reactrouter.com/) — Enrutamiento SPA
- [Axios](https://axios-http.com/) — Cliente HTTP

## 📁 Estructura del Proyecto

```
frontend/
├── public/                      # Archivos estáticos
├── src/
│   ├── components/              # Componentes reutilizables
│   │   └── PrivateRoute.jsx     # Protección de rutas autenticadas
│   ├── pages/                   # Componentes de página
│   │   ├── Login.jsx            # Inicio de sesión
│   │   ├── Register.jsx         # Registro de usuario
│   │   ├── Hoy.jsx              # Actividades del día
│   │   ├── Crear.jsx            # Crear actividad
│   │   ├── Actividad.jsx        # Detalle de actividad
│   │   ├── Progreso.jsx         # Dashboard de progreso
│   │   └── Home.jsx             # Lista de usuarios
│   ├── App.jsx                  # Router y rutas principales
│   ├── index.css                # Estilos globales (Tailwind)
│   └── main.jsx                 # Punto de entrada
├── .env                         # Variables de entorno locales (no se sube a git)
├── .env.production              # Variables de entorno para producción
├── .env.example                 # Plantilla de variables de entorno
├── index.html                   # HTML principal
├── package.json                 # Dependencias y scripts
├── tailwind.config.js           # Configuración de TailwindCSS
├── postcss.config.js            # Configuración de PostCSS
└── vite.config.js               # Configuración de Vite
```

## 🚀 Instalación y Ejecución

### Requisitos previos

- [Node.js](https://nodejs.org/) v18 o superior
- [npm](https://www.npmjs.com/) v9 o superior

### Pasos

```bash
# 1. Ir a la carpeta del frontend
cd miniProyecto/frontend

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env si es necesario

# 4. Iniciar servidor de desarrollo
npm run dev
```

El frontend estará disponible en **http://localhost:5173**

### Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Genera la build de producción |
| `npm run preview` | Previsualiza la build de producción |
| `npm run lint` | Ejecuta ESLint |

## ⚙️ Variables de Entorno

Vite selecciona el archivo automáticamente según el comando ejecutado:

| Archivo | Comando | URL de la API |
|---------|---------|---------------|
| `.env` | `npm run dev` | `http://127.0.0.1:8000` |
| `.env.production` | `npm run build` | `https://miniproyecto-back.onrender.com` |

| Variable | Descripción |
|----------|-------------|
| `VITE_API_URL` | URL base de la API del backend |

## ⚠️ Nota Importante

El **backend** debe estar corriendo antes de iniciar el frontend para que la aplicación pueda obtener los datos de la API.
