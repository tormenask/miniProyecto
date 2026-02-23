// Página de inicio de sesión.
// Implementa las 10 reglas generales de UX (Heurísticas de Nielsen):
//  1. Visibilidad del estado del sistema   → spinner de carga, border de foco
//  2. Coincidencia con el mundo real       → lenguaje natural en español
//  3. Control y libertad del usuario       → mostrar/ocultar contraseña
//  4. Consistencia y estándares            → estilos coherentes con Register
//  5. Prevención de errores                → validación antes de enviar
//  6. Reconocimiento antes que recuerdo    → labels siempre visibles (no solo placeholder)
//  7. Flexibilidad y eficiencia de uso     → autofocus en primer campo, submit con Enter
//  8. Diseño estético y minimalista        → solo la información necesaria
//  9. Recuperación de errores              → mensajes de error específicos y útiles
// 10. Ayuda y documentación               → texto de apoyo debajo del formulario

import { useState, useRef, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

export default function Login() {
  const navigate = useNavigate()
  const usernameRef = useRef(null)

  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // UX #7 – Eficiencia: autofocus en el primer campo al montar la página.
  useEffect(() => {
    usernameRef.current?.focus()
  }, [])

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
    // UX #5 – Prevención: limpiar el error en cuanto el usuario empieza a corregir.
    if (error) setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    // UX #5 – Prevención: validaciones locales antes de hacer la petición.
    if (!form.username.trim()) {
      setError('Por favor ingresa tu nombre de usuario.')
      return
    }
    if (!form.password) {
      setError('Por favor ingresa tu contraseña.')
      return
    }

    setLoading(true)
    try {
      // El endpoint de simplejwt devuelve access y refresh tokens.
      const response = await axios.post(`${API_URL}/api/auth/login/`, {
        username: form.username,
        password: form.password,
      })

      localStorage.setItem('access_token', response.data.access)
      localStorage.setItem('refresh_token', response.data.refresh)
      // Guardamos el nombre de usuario para mostrarlo en la bienvenida de /hoy.
      localStorage.setItem('username', form.username)

      navigate('/hoy')
    } catch (err) {
      // UX #9 – Recuperación: mensajes específicos según el tipo de error.
      if (err.response?.status === 401) {
        setError('Usuario o contraseña incorrectos. Verifica tus datos e intenta de nuevo.')
      } else if (!err.response) {
        setError('No se pudo conectar al servidor. Revisa tu conexión a internet.')
      } else {
        setError('Ocurrió un error al iniciar sesión. Por favor intenta de nuevo.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    // UX #8 – Minimalismo: fondo suave, tarjeta centrada sin distracciones.
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">

        {/* UX #2 – Mundo real: encabezado claro y amigable */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Iniciar sesión</h1>
          <p className="text-sm text-gray-500 mt-1">Ingresa tus datos para continuar</p>
        </div>

        {/* UX #9 – Error visible con ícono y descripción clara */}
        {error && (
          <div
            role="alert"
            className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-5 text-sm flex items-start gap-2"
          >
            <span className="shrink-0 mt-0.5">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">

          {/* UX #6 – Label siempre visible, no solo placeholder */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Usuario
            </label>
            <input
              ref={usernameRef}
              id="username"
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              autoComplete="username"
              placeholder="Tu nombre de usuario"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         transition-all"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            {/* UX #3 – Control: el usuario puede ver su contraseña para evitar errores */}
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
                placeholder="Tu contraseña"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 pr-10 text-sm
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm select-none"
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {/* UX #1 – Estado del sistema: spinner durante la petición */}
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed
                       text-white font-semibold rounded-lg py-2.5 px-4 transition-colors
                       flex items-center justify-center gap-2 mt-1"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Ingresando...
              </>
            ) : (
              'Ingresar'
            )}
          </button>
        </form>

        {/* UX #10 – Documentación: guía al usuario hacia el registro si no tiene cuenta */}
        <p className="text-center text-sm text-gray-500 mt-6">
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="text-blue-600 hover:underline font-medium">
            Regístrate aquí
          </Link>
        </p>

      </div>
    </div>
  )
}
