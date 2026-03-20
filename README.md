# 🖥️ miniProyecto — Frontend

Frontend del Proyecto Integrador I, construido con **React**, **Vite** y **TailwindCSS**.

## 📋 Descripción

Aplicación web que consume la API REST del backend para gestionar actividades académicas (tareas, exámenes, talleres, proyectos). Incluye autenticación JWT con rotación de tokens, vista del día con WebSocket en tiempo real, gestión completa de actividades y subactividades, detección de conflictos de horas, perfil de usuario editable y cambio de contraseña.

## 🗺️ Rutas

| Ruta | Página | Acceso |
|------|--------|--------|
| `/login` | Login | Pública |
| `/register` | Register | Pública |
| `/hoy` | Hoy | Privada |
| `/home` | Home | Privada |
| `/MisActividades` | MisActividades | Privada |
| `/CrearActividad` | CrearActividad | Privada |
| `/actividad/:id` | DetalleActividad | Privada |
| `/actividad/:id/editar` | EditarActividad | Privada |
| `/hoy/actividad/:id` | HoyActividad | Pública (token por URL) |
| `/perfil` | Perfil | Privada |
| `/progreso` | Progreso | Privada |

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
    │   ├── hoy/                      # Componentes exclusivos de Vista Hoy
    │   │   ├── TodayView.jsx         # Contenedor principal de la vista
    │   │   ├── TaskCard.jsx          # Tarjeta de actividad en la vista Hoy
    │   │   ├── Section.jsx           # Sección (Vencidas / Hoy / Próximas)
    │   │   ├── SortRules.jsx         # Selector de ordenamiento
    │   │   ├── TaskSkeleton.jsx      # Skeleton loader de tarjeta
    │   │   ├── ModalReorganizar.jsx  # Modal para mover subactividades de día
    │   │   └── EmptyTasks.jsx        # Estado vacío
    │   ├── ActividadCard.jsx         # Tarjeta de actividad en MisActividades
    │   ├── Alert.jsx                 # Alerta inline (danger / warning / success)
    │   ├── AlertaHoras.jsx           # Alerta de conflicto de horas diarias
    │   ├── ConfigLimiteHoras.jsx     # Input para configurar límite de horas/día
    │   ├── ErrorAlert.jsx            # Alerta de error de página
    │   ├── Modal.jsx                 # Modal reutilizable
    │   ├── Navbar.jsx                # Barra de navegación con dropdown de usuario
    │   ├── PrivateRoute.jsx          # Protección de rutas autenticadas
    │   ├── Select.jsx                # Dropdown personalizado
    │   ├── SubtareaForm.jsx          # Formulario para agregar subactividad
    │   ├── SubtareaItem.jsx          # Item individual de subactividad (toggle/editar/eliminar)
    │   ├── SubtareaList.jsx          # Lista y gestión de subactividades con resolución de conflictos
    │   └── Toast.jsx                 # Notificación temporal de éxito/error
    ├── hooks/
    │   ├── useActividad.js           # Carga de una actividad por ID
    │   ├── useActividades.js         # Carga de actividades del usuario
    │   ├── useHoy.js                 # Datos de hoy vía REST + WebSocket
    │   ├── useLimiteHoras.js         # Límite de horas diarias (GET/PATCH perfil)
    │   └── useSubtareas.js           # CRUD de subactividades con manejo de conflictos 409
    ├── pages/
    │   ├── Login.jsx                 # Inicio de sesión
    │   ├── Register.jsx              # Registro de usuario
    │   ├── Home.jsx                  # Página de inicio
    │   ├── Hoy.jsx                   # Vista del día
    │   ├── HoyActividad.jsx          # Detalle de actividad desde Vista Hoy
    │   ├── MisActividades.jsx        # Lista con filtros por tipo y curso
    │   ├── CrearActividad.jsx        # Crear actividad con subactividades
    │   ├── Detalleactividad.jsx      # Detalle + gestión de subactividades
    │   ├── Editaractividad.jsx       # Editar actividad existente
    │   ├── Perfil.jsx                # Perfil de usuario (datos, preferencias, contraseña)
    │   └── Progreso.jsx              # Dashboard de progreso
    ├── utils/
    │   ├── auth.js                   # refreshAccessToken() + authFetch()
    │   ├── cursos.js                 # Constantes de cursos (CURSOS, CURSO_LABEL)
    │   └── horasUtils.js             # Detección de conflictos y sugerencias de días
    ├── App.jsx                       # Router, rutas y renovación proactiva de token
    ├── index.css                     # Estilos globales (Tailwind + design tokens)
    └── main.jsx                      # Punto de entrada
```

## 🔐 Autenticación

- JWT con **rotación de refresh token**: cada vez que se renueva el access token, el nuevo refresh token también se guarda.
- `authFetch()` en `utils/auth.js` reintenta automáticamente con token renovado ante un 401.
- Renovación proactiva cada **14 minutos** desde `App.jsx`.
- Si el token expira, el usuario es redirigido a `/login` con aviso de sesión expirada.
- `PrivateRoute` protege todas las rutas que requieren sesión activa.

## 🔀 Gestión de Subactividades (US-06/07/08)

Al editar la fecha u horas de una subactividad, el backend puede responder `409 Conflict` si se supera el límite de horas diarias configurado. El flujo en el frontend es:

1. Se muestra el conflicto con las horas planificadas vs. el límite.
2. El usuario puede **mover la subactividad** a un día sugerido con horas disponibles.
3. O puede **guardar de todas formas** ignorando el límite (`forzar: true`).

El límite de horas diarias se sincroniza con el backend via `GET/PATCH /api/users/profile/`.

## ⚡ Vista Hoy (WebSocket)

`useHoy.js` obtiene las actividades del día desde `GET /api/activities/today/` y se suscribe a actualizaciones en tiempo real vía WebSocket (`wss://.../ws/activities/today/?token=`). La clasificación en **vencidas / hoy / próximas** se ajusta en el cliente usando la zona horaria `America/Bogota`.

## 👤 Perfil de Usuario

La página `/perfil` permite:
- Editar nombre, apellido, nombre de usuario y email.
- Configurar el límite de horas diarias.
- Cambiar la contraseña con validación de la contraseña actual.

Todos los cambios se persisten en el backend via `PATCH /api/users/profile/` y `POST /api/users/change-password/`.

## 🚀 Instalación y Ejecución

### Requisitos previos

- [Node.js](https://nodejs.org/) v18 o superior
- npm v9 o superior

### Pasos

```bash
# 1. Ir a la carpeta del frontend
cd miniProyecto/frontend

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno (si es necesario)
cp .env.example .env

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

| Archivo | Comando | URL de la API |
|---------|---------|---------------|
| `.env` | `npm run dev` | `http://127.0.0.1:8000` |
| `.env.production` | `npm run build` | `https://miniproyecto-backend.onrender.com` |

| Variable | Descripción |
|----------|-------------|
| `VITE_API_URL` | URL base de la API del backend |

## ⚠️ Nota

El **backend** debe estar corriendo antes de iniciar el frontend. Repositorio del backend disponible por separado.
