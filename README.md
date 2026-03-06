# 🖥️ miniProyecto — Frontend

Frontend del Proyecto Integrador I, construido con **React**, **Vite** y **TailwindCSS**.

## 📋 Descripción

Aplicación web que consume la API REST del backend para gestionar actividades académicas (tareas, exámenes, talleres). Incluye autenticación JWT con rotación de tokens, vista de actividades del día con WebSocket, y gestión completa de actividades y subtareas.

## 🗺️ Rutas

| Ruta | Página | Descripción |
|------|--------|-------------|
| `/login` | Login | Inicio de sesión |
| `/register` | Register | Registro de nuevo usuario |
| `/hoy` | Hoy | Actividades del día (página principal) |
| `/home` | Home | Página de inicio |
| `/MisActividades` | MisActividades | Lista y filtrado de actividades |
| `/CrearActividad` | CrearActividad | Formulario para crear actividad con subtareas |
| `/actividad/:id` | DetalleActividad | Detalle, subtareas y eliminación |
| `/actividad/:id/editar` | EditarActividad | Editar actividad existente |
| `/progreso` | Progreso | Dashboard de progreso |

## 🛠️ Tecnologías

- [React 18](https://react.dev/) — Biblioteca de UI
- [Vite 5](https://vitejs.dev/) — Build tool y servidor de desarrollo
- [TailwindCSS 3](https://tailwindcss.com/) — Framework de estilos utilitarios
- [React Router 7](https://reactrouter.com/) — Enrutamiento SPA
- [Axios](https://axios-http.com/) — Cliente HTTP
- [Lucide React](https://lucide.dev/) — Iconos

## 📁 Estructura del Proyecto

```
frontend/
├── public/
└── src/
    ├── components/
    │   ├── hoy/                     # Componentes exclusivos de Vista Hoy
    │   │   ├── TodayView.jsx        # Contenedor principal de la vista
    │   │   ├── TaskCard.jsx         # Tarjeta de actividad en la vista Hoy
    │   │   ├── Section.jsx          # Sección (Vencidas / Hoy / Próximas)
    │   │   ├── SortRules.jsx        # Selector de ordenamiento
    │   │   ├── TaskSkeleton.jsx     # Skeleton loader de tarjeta
    │   │   └── EmptyTasks.jsx       # Estado vacío
    │   ├── ActividadCard.jsx        # Tarjeta de actividad en MisActividades
    │   ├── Alert.jsx                # Alerta inline (danger / warning / success)
    │   ├── ErrorAlert.jsx           # Alerta de error de página
    │   ├── Navbar.jsx               # Barra de navegación
    │   ├── PrivateRoute.jsx         # Protección de rutas autenticadas
    │   ├── Select.jsx               # Dropdown personalizado con diseño propio
    │   ├── SubtareaForm.jsx         # Formulario para agregar subtarea
    │   ├── SubtareaList.jsx         # Lista y gestión de subtareas
    │   └── Toast.jsx                # Notificación temporal de éxito
    ├── hooks/
    │   ├── useActividades.js        # Carga de actividades del usuario
    │   ├── useHoy.js                # Datos de hoy vía REST + WebSocket
    │   └── useSubtareas.js          # CRUD de subtareas de una actividad
    ├── pages/
    │   ├── Login.jsx                # Inicio de sesión
    │   ├── Register.jsx             # Registro de usuario
    │   ├── Home.jsx                 # Página de inicio
    │   ├── Hoy.jsx                  # Vista del día
    │   ├── MisActividades.jsx       # Lista con filtros por tipo y curso
    │   ├── CrearActividad.jsx       # Crear actividad con subtareas
    │   ├── Detalleactividad.jsx     # Detalle + subtareas
    │   ├── Editaractividad.jsx      # Editar actividad
    │   └── Progreso.jsx             # Dashboard de progreso
    ├── utils/
    │   ├── auth.js                  # refreshAccessToken() + authFetch()
    │   └── cursos.js                # Constantes de cursos (CURSOS, CURSO_LABEL)
    ├── App.jsx                      # Router, rutas y renovación de token
    ├── index.css                    # Estilos globales (Tailwind)
    └── main.jsx                     # Punto de entrada
```

## 🔐 Autenticación

- JWT con **rotación de refresh token**: cada vez que se renueva el access token, el nuevo refresh token también se guarda.
- `authFetch()` en `utils/auth.js` reintenta automáticamente con token renovado ante un 401.
- Renovación proactiva cada **14 minutos** desde `App.jsx`.
- Si el token expira por inactividad, el usuario es redirigido a `/login` con un aviso de sesión expirada.

## ⚡ Vista Hoy (WebSocket)

`useHoy.js` obtiene las actividades del día desde `GET /api/activities/today/` y se suscribe a actualizaciones en tiempo real vía WebSocket (`wss://.../ws/activities/today/?token=`). La clasificación en `vencidas` / `hoy` / `próximas` se ajusta en el cliente usando la zona horaria `America/Bogota`.

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
| `.env.production` | `npm run build` | `https://miniproyecto-backend.onrender.com` |

| Variable | Descripción |
|----------|-------------|
| `VITE_API_URL` | URL base de la API del backend |

## ⚠️ Nota Importante

El **backend** debe estar corriendo antes de iniciar el frontend para que la aplicación pueda obtener los datos de la API.
