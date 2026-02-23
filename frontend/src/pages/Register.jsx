// Página de registro de nuevos usuarios.
// Implementa las 10 reglas generales de UX (Heurísticas de Nielsen):
//  1. Visibilidad del estado del sistema   → spinner de carga, indicador de fortaleza de contraseña
//  2. Coincidencia con el mundo real       → lenguaje natural en español
//  3. Control y libertad del usuario       → mostrar/ocultar contraseñas, link a login
//  4. Consistencia y estándares            → estilos coherentes con Login
//  5. Prevención de errores                → validación en tiempo real y antes de enviar
//  6. Reconocimiento antes que recuerdo    → labels siempre visibles, requisitos siempre visibles
//  7. Flexibilidad y eficiencia de uso     → autofocus en primer campo, submit con Enter
//  8. Diseño estético y minimalista        → solo la información necesaria
//  9. Recuperación de errores              → mensajes de error específicos y útiles
// 10. Ayuda y documentación               → indicador de fortaleza + lista de requisitos

import { useState, useRef, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

// UX #10 – Documentación: calcula la fortaleza de la contraseña para guiar al usuario.
function getPasswordStrength(password) {
  if (!password) return null
  const hasMinLength = password.length >= 8
  const hasLetters   = /[a-zA-Z]/.test(password)
  const hasNumbers   = /[0-9]/.test(password)
  const hasSpecial   = /[^a-zA-Z0-9]/.test(password)

  const score = [hasMinLength, hasLetters, hasNumbers, hasSpecial].filter(Boolean).length

  if (score <= 1) return { label: 'Muy débil',  color: 'bg-red-500',    width: 'w-1/4' }
  if (score === 2) return { label: 'Débil',      color: 'bg-orange-400', width: 'w-2/4' }
  if (score === 3) return { label: 'Buena',      color: 'bg-yellow-400', width: 'w-3/4' }
  return              { label: 'Fuerte',      color: 'bg-green-500',  width: 'w-full' }
}

export default function Register() {
  const navigate = useNavigate()
  const usernameRef = useRef(null)

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError]     = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword]        = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // UX #7 – Eficiencia: autofocus en el primer campo al montar la página.
  useEffect(() => {
    usernameRef.current?.focus()
  }, [])

  const strength = getPasswordStrength(form.password)

  // UX #5 – Prevención: verificación en tiempo real de que las contraseñas coincidan.
  const passwordsMatch =
    form.confirmPassword === '' || form.password === form.confirmPassword

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
    if (error) setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    // UX #5 – Prevención: validaciones locales antes de hacer la petición.
    if (!form.username.trim()) {
      setError('Por favor ingresa un nombre de usuario.')
      return
    }
    if (form.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.')
      return
    }
    if (form.password !== form.confirmPassword) {
      setError('Las contraseñas no coinciden. Verifica e intenta de nuevo.')
      return
    }

    setLoading(true)
    try {
      await axios.post(`${API_URL}/api/users/register/`, {
        username: form.username,
        email:    form.email,
        password: form.password,
      })
      setSuccess(true)
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      // UX #9 – Recuperación: mensaje específico desde el backend o genérico.
      const msg = err.response?.data?.error
      if (!err.response) {
        setError('No se pudo conectar al servidor. Revisa tu conexión a internet.')
      } else {
        setError(msg || 'Error al crear la cuenta. Por favor intenta de nuevo.')
      }
    } finally {
      setLoading(false)
    }
  }

  // UX #1 – Estado: pantalla de confirmación tras registro exitoso.
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md text-center">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">¡Cuenta creada!</h2>
          <p className="text-sm text-gray-500">Te redirigimos al inicio de sesión...</p>
        </div>
      </div>
    )
  }

  return (
    // UX #8 – Minimalismo: fondo suave, tarjeta centrada sin distracciones.
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">

        {/* UX #2 – Mundo real: encabezado claro y amigable */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Crear cuenta</h1>
          <p className="text-sm text-gray-500 mt-1">Completa los datos para registrarte</p>
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

          {/* UX #6 – Label siempre visible */}
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
              placeholder="Elige un nombre de usuario"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         transition-all"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-gray-400 font-normal">(opcional)</span>
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              placeholder="tu@email.com"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         transition-all"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            {/* UX #3 – Control: el usuario puede ver su contraseña */}
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
                placeholder="Mínimo 8 caracteres"
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

            {/* UX #10 – Documentación: indicador visual de fortaleza */}
            {strength && (
              <div className="mt-2">
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${strength.color} ${strength.width}`} />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Fortaleza: <span className="font-medium">{strength.label}</span>
                </p>
              </div>
            )}

            {/* UX #10 – Lista de requisitos siempre visible */}
            <ul className="mt-2 text-xs text-gray-400 space-y-0.5 list-none">
              <li className={form.password.length >= 8 ? 'text-green-600' : ''}>
                {form.password.length >= 8 ? '✓' : '○'} Al menos 8 caracteres
              </li>
              <li className={/[0-9]/.test(form.password) ? 'text-green-600' : ''}>
                {/[0-9]/.test(form.password) ? '✓' : '○'} Al menos un número
              </li>
              <li className={/[^a-zA-Z0-9]/.test(form.password) ? 'text-green-600' : ''}>
                {/[^a-zA-Z0-9]/.test(form.password) ? '✓' : '○'} Al menos un carácter especial (recomendado)
              </li>
            </ul>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirmar contraseña
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                placeholder="Repite tu contraseña"
                className={`w-full border rounded-lg px-3 py-2.5 pr-10 text-sm
                            focus:outline-none focus:ring-2 focus:border-transparent transition-all
                            ${!passwordsMatch
                              ? 'border-red-400 focus:ring-red-400'
                              : 'border-gray-300 focus:ring-blue-500'
                            }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm select-none"
                aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showConfirmPassword ? '🙈' : '👁️'}
              </button>
            </div>
            {/* UX #5 – Prevención en tiempo real: alerta antes del submit */}
            {!passwordsMatch && (
              <p className="text-xs text-red-500 mt-1">Las contraseñas no coinciden.</p>
            )}
          </div>

          {/* UX #1 – Estado del sistema: spinner durante la petición */}
          <button
            type="submit"
            disabled={loading || !passwordsMatch}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed
                       text-white font-semibold rounded-lg py-2.5 px-4 transition-colors
                       flex items-center justify-center gap-2 mt-1"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Registrando...
              </>
            ) : (
              'Crear cuenta'
            )}
          </button>
        </form>

        {/* UX #10 – Documentación: guía al usuario hacia el login si ya tiene cuenta */}
        <p className="text-center text-sm text-gray-500 mt-6">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-blue-600 hover:underline font-medium">
            Inicia sesión aquí
          </Link>
        </p>

      </div>
    </div>
  )
}
