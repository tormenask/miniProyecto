// Componente raíz que define todas las rutas de la aplicación.
// Las rutas protegidas redirigen a /login si el usuario no tiene sesión activa.
import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import PrivateRoute from './components/PrivateRoute'
import { refreshAccessToken } from './utils/auth'
import Home from './pages/Home'
import Hoy from './pages/Hoy'
import CrearActividad from './pages/CrearActividad'
import Progreso from './pages/Progreso'
import Login from './pages/Login'
import Register from './pages/Register'
import MisActividades from './pages/MisActividades'
import DetalleActividad from './pages/Detalleactividad'
import EditarActividad from './pages/Editaractividad'
import HoyActividad from './pages/HoyActividad'
import Perfil from './pages/Perfil'

// Renueva el access token cada 14 minutos mientras haya sesión activa.
// Si el refresh falla (token expirado por inactividad), redirige al login.
const RENEWAL_INTERVAL = 14 * 60 * 1000

function App() {
  useEffect(() => {
    if (!localStorage.getItem('refresh_token')) return
    const interval = setInterval(async () => {
      if (!localStorage.getItem('refresh_token')) return
      try {
        await refreshAccessToken()
      } catch {
        localStorage.setItem('session_expired', '1')
        window.location.href = '/login'
      }
    }, RENEWAL_INTERVAL)
    return () => clearInterval(interval)
  }, [])

  return (
    <Router>
      <Routes>
        {/* La raíz redirige a /hoy; PrivateRoute se encarga si no hay sesión */}
        <Route path="/" element={<Navigate to="/hoy" replace />} />

        {/* Rutas protegidas: requieren token de acceso */}
        <Route path="/hoy" element={<PrivateRoute><Hoy /></PrivateRoute>} />
        <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/CrearActividad" element={<PrivateRoute><CrearActividad /></PrivateRoute>} />
        <Route path="/progreso" element={<PrivateRoute><Progreso /></PrivateRoute>} />
        <Route path="/MisActividades" element={<PrivateRoute><MisActividades /></PrivateRoute>} />
        <Route path="/actividad/:id" element={<PrivateRoute><DetalleActividad /></PrivateRoute>} />
        <Route path="/actividad/:id/editar" element={<PrivateRoute><EditarActividad /></PrivateRoute>} />
        <Route path="/hoy/actividad/:id" element={<HoyActividad />} />
        <Route path="/perfil" element={<PrivateRoute><Perfil /></PrivateRoute>} />
        {/* Rutas de autenticación */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  )
}

export default App