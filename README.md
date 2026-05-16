# miniProyecto — Frontend

Frontend del Proyecto Integrador I, construido con **React**, **Vite** y **TailwindCSS**.

## Descripción

Aplicación web para gestionar actividades académicas (tareas, exámenes, talleres, proyectos) y sus subactividades. Incluye autenticación JWT con renovación automática, vista del día con WebSocket en tiempo real, detección y resolución de conflictos de horas, perfil de usuario y dashboard de progreso.

---

## Rutas

| Ruta | Página | Acceso |
|------|--------|--------|
| `/login` | Login | Pública |
| `/register` | Register | Pública |
| `/hoy` | Vista Hoy | Privada |
| `/home` | Home | Privada |
| `/MisActividades` | Mis Actividades | Privada |
| `/CrearActividad` | Crear Actividad | Privada |
| `/actividad/:id` | Detalle de Actividad | Privada |
| `/actividad/:id/editar` | Editar Actividad | Privada |
| `/hoy/actividad/:id` | Detalle desde Vista Hoy | Privada |
| `/perfil` | Perfil | Privada |
| `/progreso` | Progreso | Privada |

---

## Tecnologías

- [React 18](https://react.dev/)
- [Vite 5](https://vitejs.dev/)
- [TailwindCSS 3](https://tailwindcss.com/)
- [React Router 7](https://reactrouter.com/)
- [Lucide React](https://lucide.dev/) — iconos

---

## Estructura del proyecto

```
frontend/src/
├── components/
│   ├── hoy/
│   │   ├── SubtareaHoyCard.jsx   # Tarjeta de subtarea en Vista Hoy (toggle, posponer, reprogramar)
│   │   ├── Section.jsx           # Sección Vencidas / Hoy / Próximas
│   │   ├── ResumenHoras.jsx      # Resumen de horas planificadas del día
│   │   ├── ModalReorganizar.jsx  # Modal para redistribuir subtareas con exceso de horas
│   │   ├── TaskCard.jsx          # Tarjeta de actividad (uso interno)
│   │   ├── SortRules.jsx         # Selector de ordenamiento
│   │   ├── TaskSkeleton.jsx      # Skeleton loader
│   │   ├── EmptyTasks.jsx        # Estado vacío
│   │   └── ErrorState.jsx        # Estado de error
│   ├── ActividadCard.jsx         # Tarjeta de actividad en MisActividades
│   ├── Alert.jsx                 # Alerta inline (danger / warning / success)
│   ├── AlertaHoras.jsx           # Aviso de conflicto de horas diarias
│   ├── ConflictoModal.jsx        # Modal de resolución de conflicto 409 (mover / reducir / forzar)
│   ├── Modal.jsx                 # Modal reutilizable
│   ├── Navbar.jsx                # Barra de navegación con menú de usuario
│   ├── PrivateRoute.jsx          # Protección de rutas (valida expiración JWT)
│   ├── Select.jsx                # Dropdown personalizado accesible
│   ├── SubtareaForm.jsx          # Formulario para agregar subactividad
│   ├── SubtareaItem.jsx          # Item de subactividad con estado enum (pendiente/hecha/pospuesta)
│   ├── SubtareaList.jsx          # Lista de subactividades con acciones
│   └── Toast.jsx                 # Notificación temporal
├── hooks/
│   ├── useActividad.js           # Carga una actividad por ID
│   ├── useActividades.js         # Lista de actividades del usuario
│   ├── useHoy.js                 # Datos de Vista Hoy (REST + WebSocket) con filtros de curso/estado
│   ├── useLimiteHoras.js         # Límite de horas diarias desde el perfil
│   ├── useProfile.js             # Perfil del usuario con caché singleton
│   ├── useReorganizar.js         # Lógica para detectar y reorganizar subtareas con exceso
│   ├── useReprogramar.js         # PATCH de fecha_objetivo con manejo de conflicto 409
│   └── useSubtareas.js           # CRUD de subactividades
├── pages/
│   ├── Login.jsx                 # Inicio de sesión
│   ├── Register.jsx              # Registro
│   ├── Home.jsx                  # Página de inicio
│   ├── Hoy.jsx                   # Vista del día con filtros y reorganización
│   ├── HoyActividad.jsx          # Detalle de actividad desde Vista Hoy
│   ├── MisActividades.jsx        # Lista de actividades con filtros
│   ├── CrearActividad.jsx        # Crear actividad con subactividades
│   ├── Detalleactividad.jsx      # Detalle y gestión de subactividades
│   ├── Editaractividad.jsx       # Editar actividad existente
│   ├── Perfil.jsx                # Perfil de usuario y cambio de contraseña
│   └── Progreso.jsx              # Dashboard de progreso
├── utils/
│   ├── auth.js                   # authFetch, refreshAccessToken, isTokenExpired
│   ├── cursos.js                 # Constantes de cursos (CURSOS, CURSO_LABEL)
│   ├── formatDate.js             # Formateador de fechas de sugerencias
│   └── horasUtils.js             # Detección de conflictos de horas y sugerencias de días
├── App.jsx                       # Router, rutas y renovación proactiva de token (cada 14 min)
├── index.css                     # Estilos globales (Tailwind + design tokens)
└── main.jsx                      # Punto de entrada
```

---

## Autenticación y sesión

El módulo central es `utils/auth.js`. Todas las peticiones autenticadas pasan por `authFetch()`.

### Flujo de renovación

1. `authFetch(url, options)` agrega el header `Authorization: Bearer <token>` automáticamente.
2. Si el servidor responde `401`, intenta renovar el token con `refreshAccessToken()`.
3. Si la renovación tiene éxito, reintenta la petición original con el nuevo token.
4. Si la renovación falla, muestra un **toast** "Tu sesión expiró. Redirigiendo..." durante 2 segundos y redirige a `/login`.

### Deduplicación de refreshes

Si múltiples hooks reciben `401` al mismo tiempo (por ejemplo, cuando la página carga varios recursos en paralelo), se dispara **un solo refresh** gracias a la promesa compartida `_refreshPromise`. Todos los callers esperan el mismo resultado.

### PrivateRoute

Antes de renderizar una ruta protegida:
- Si no hay token → redirige a `/login`.
- Si el token existe pero expiró (verificado decodificando el `exp` del JWT) → intenta `refreshAccessToken()`. Si funciona, pasa. Si falla, redirige a `/login`.

### Renovación proactiva

`App.jsx` ejecuta `refreshAccessToken()` cada **14 minutos** como respaldo, independientemente del flujo reactivo de `authFetch`.

---

## Estado de subtareas

Las subtareas usan un **enum de estado** en lugar del booleano `completada`:

| Estado | Significado |
|--------|-------------|
| `pendiente` | Sin completar |
| `hecha` | Completada |
| `pospuesta` | Pospuesta (incluye `nota_posposicion` opcional) |

---

## Vista Hoy

`useHoy.js` obtiene los datos desde `GET /api/activities/today/` y se suscribe a actualizaciones en tiempo real vía WebSocket (`wss://.../ws/activities/today/?token=`).

El backend retorna subtareas como items de primer nivel dentro de las secciones `overdue`, `today` y `upcoming`, con el objeto `activity` anidado en cada subtarea.

### Filtros disponibles

| Parámetro | Valores |
|-----------|---------|
| `?curso=` | Nombre del curso |
| `?estado=` | `pendiente` \| `pospuesta` |

Las subtareas con `estado='hecha'` son excluidas automáticamente por el backend.

### Acciones inline en SubtareaHoyCard

- **Toggle**: marca como hecha / pendiente.
- **Posponer**: marca como pospuesta con nota opcional.
- **Reprogramar**: cambia la `fecha_objetivo`. Si hay conflicto de horas → abre `ConflictoModal`.

---

## Conflictos de horas (US-06/07/08)

Cuando se reprograma una subtarea y el día destino supera el límite de horas diarias, el backend responde `409` con el formato:

```json
{
  "error": {
    "code": "OVERLOAD_CONFLICT",
    "message": "...",
    "detail": { "target_date": "...", "planned_hours": 9, "daily_limit": 7 },
    "suggestions": [
      { "type": "move", "available_dates": [{ "date": "...", "available_hours": 7 }] },
      { "type": "reduce", "current_hours": 3, "max_without_conflict": 1 },
      { "type": "force" }
    ]
  }
}
```

`ConflictoModal` normaliza este formato y ofrece tres opciones al usuario:

1. **Mover** la subtarea a una de las fechas sugeridas.
2. **Reducir** las horas estimadas para caber en el día original.
3. **Forzar** el guardado aceptando la sobrecarga (`forzar: true`).

`useReprogramar` maneja el estado del conflicto y la resolución, usando `authFetch` para todas las peticiones.

---

## Instalación y ejecución

### Requisitos

- Node.js v18 o superior
- npm v9 o superior
- Backend corriendo (ver repositorio del backend)

### Pasos

```bash
cd miniProyecto/frontend
npm install
npm run dev
```

Disponible en **http://localhost:5173**

### Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run preview` | Previsualiza la build |
| `npm run lint` | Ejecuta ESLint |

---

## Variables de entorno

| Variable | Descripción | Default |
|----------|-------------|---------|
| `VITE_API_URL` | URL base de la API REST | `http://127.0.0.1:8000` |

Crear un archivo `.env` en `frontend/` con:

```
VITE_API_URL=http://127.0.0.1:8000
```
