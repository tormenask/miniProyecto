// Componente de ruta protegida.
// Decodifica el JWT para verificar si ya expiró. Si expiró, intenta refresh
// antes de bloquear el acceso. Si no hay token o el refresh falla, redirige al login.
import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { isTokenExpired, refreshAccessToken } from '../utils/auth'

export default function PrivateRoute({ children }) {
  const token = localStorage.getItem('access_token')

  const [state, setState] = useState(() => {
    if (!token) return 'no-token'
    if (!isTokenExpired(token)) return 'ok'
    return 'checking' // token existe pero expiró → intentar refresh
  })

  useEffect(() => {
    if (state !== 'checking') return
    refreshAccessToken()
      .then(() => setState('ok'))
      .catch(() => {
        localStorage.setItem('session_expired', '1')
        setState('expired')
      })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (state === 'no-token' || state === 'expired') return <Navigate to="/login" replace />
  if (state === 'checking') return null // breve espera mientras se refresca
  return children
}
