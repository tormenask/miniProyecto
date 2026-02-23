// Componente de ruta protegida.
// Si el usuario no tiene token de acceso, redirige a /login en lugar de renderizar la página.
import { Navigate } from 'react-router-dom'

export default function PrivateRoute({ children }) {
  const token = localStorage.getItem('access_token')
  return token ? children : <Navigate to="/login" replace />
}
