// Componente raíz que define todas las rutas de la aplicación.
// Las rutas protegidas redirigen a /login si el usuario no tiene sesión activa.
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import PrivateRoute from './components/PrivateRoute'
import Home from './pages/Home'
import Hoy from './pages/Hoy'
import CrearActividad from './pages/CrearActividad'
import Progreso from './pages/Progreso'
import Login from './pages/Login'
import Register from './pages/Register'
import MisActividades from './pages/MisActividades'
import DetalleActividad from './pages/Detalleactividad'
import EditarActividad from './pages/Editaractividad'

function App() {
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

        {/* Rutas de autenticación */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  )
}

export default App