const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

// Promesa compartida — evita múltiples refreshes en paralelo si varios hooks
// reciben 401 al mismo tiempo. Todos esperan el mismo resultado.
let _refreshPromise = null

/**
 * Decodifica el JWT y verifica si ya expiró (sin verificar firma).
 * Usado por PrivateRoute para detectar expiración antes de hacer requests.
 */
export function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return Date.now() >= payload.exp * 1000
  } catch {
    return true
  }
}

/**
 * Renueva el access token usando el refresh token.
 * Usa una promesa compartida: si hay un refresh en curso, los nuevos callers
 * esperan esa promesa en lugar de lanzar una nueva petición.
 */
export function refreshAccessToken() {
  if (_refreshPromise) return _refreshPromise

  _refreshPromise = (async () => {
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
  })().finally(() => { _refreshPromise = null })

  return _refreshPromise
}

/**
 * Muestra un toast DOM informando la expiración, limpia tokens
 * y redirige al login después de 2 segundos.
 */
function expireAndRedirect() {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  localStorage.setItem('session_expired', '1')

  const el = document.createElement('div')
  el.style.cssText = [
    'position:fixed', 'top:24px', 'left:50%', 'transform:translateX(-50%)',
    'background:#1a1a1a', 'color:#fff', 'padding:14px 24px',
    'border-radius:10px', 'font-size:14px', 'font-family:inherit',
    'z-index:99999', 'box-shadow:0 4px 16px rgba(0,0,0,0.35)',
    'white-space:nowrap', 'pointer-events:none',
  ].join(';')
  el.textContent = 'Tu sesión expiró. Redirigiendo al inicio de sesión…'
  document.body.appendChild(el)

  setTimeout(() => {
    el.remove()
    window.location.href = '/login'
  }, 2000)
}

/**
 * Wrapper de fetch con Authorization automático.
 * Si recibe 401 → intenta refrescar (deduplicado) → reintenta.
 * Si el refresh falla → toast + redirect al login.
 */
export async function authFetch(url, options = {}) {
  const makeHeaders = (token) => ({
    'Content-Type': 'application/json',
    ...options.headers,
    Authorization: `Bearer ${token}`,
  })

  let token = localStorage.getItem('access_token')
  let res = await fetch(url, { ...options, headers: makeHeaders(token) })

  if (res.status === 401) {
    try {
      token = await refreshAccessToken()
      res = await fetch(url, { ...options, headers: makeHeaders(token) })
    } catch {
      expireAndRedirect()
      throw new Error('Sesión expirada. Inicia sesión de nuevo.')
    }
  }

  return res
}
