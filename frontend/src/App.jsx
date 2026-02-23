// Componente raíz que define todas las rutas de la aplicación.
// Las rutas protegidas redirigen a /login si el usuario no tiene sesión activa.
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import PrivateRoute from './components/PrivateRoute'
import Home from './pages/Home'
import Hoy from './pages/Hoy'
import Crear from './pages/Crear'
import Actividad from './pages/Actividad'
import Progreso from './pages/Progreso'
import Login from './pages/Login'
import Register from './pages/Register'

function App() {
  return (
    <Router>
      <Routes>
        {/* La raíz redirige a /hoy; PrivateRoute se encarga si no hay sesión */}
        <Route path="/" element={<Navigate to="/hoy" replace />} />

        {/* Rutas protegidas: requieren token de acceso */}
        <Route path="/hoy"           element={<PrivateRoute><Hoy /></PrivateRoute>} />
        <Route path="/home"          element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/crear"         element={<PrivateRoute><Crear /></PrivateRoute>} />
        <Route path="/actividad/:id" element={<PrivateRoute><Actividad /></PrivateRoute>} />
        <Route path="/progreso"      element={<PrivateRoute><Progreso /></PrivateRoute>} />

        {/* Rutas de autenticación */}
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  )
}

export default App
