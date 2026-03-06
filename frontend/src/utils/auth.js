const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

/**
 * Renueva el access token usando el refresh token.
 * Guarda AMBOS tokens nuevos en localStorage (el refresh rota en cada uso).
 * Lanza error si el refresh falló o no existe refresh token.
 */
export async function refreshAccessToken() {
  const refresh = localStorage.getItem('refresh_token')
  if (!refresh) throw new Error('No hay refresh token.')

  const res = await fetch(`${API_URL}/api/auth/token/refresh/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh }),
  })

  if (!res.ok) throw new Error('Sesión expirada.')

  const { access, refresh: newRefresh } = await res.json()
  localStorage.setItem('access_token', access)
  if (newRefresh) localStorage.setItem('refresh_token', newRefresh)
  return access
}

/**
 * Wrapper de fetch que añade Authorization automático.
 * Si recibe 401, intenta refrescar el token y reintenta la petición.
 * Si el refresh falla, redirige al login.
 */
export async function authFetch(url, options = {}) {
  const makeHeaders = (token) => ({
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    ...options.headers,
  })

  let token = localStorage.getItem('access_token')
  let res = await fetch(url, { ...options, headers: makeHeaders(token) })

  if (res.status === 401) {
    try {
      token = await refreshAccessToken()
      res = await fetch(url, { ...options, headers: makeHeaders(token) })
    } catch {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      localStorage.setItem('session_expired', '1')
      window.location.href = '/login'
      throw new Error('Sesión expirada. Inicia sesión de nuevo.')
    }
  }

  return res
}
