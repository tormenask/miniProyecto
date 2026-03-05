// Página de registro — 10 heurísticas de Nielsen aplicadas con design system corporativo.
import { useState, useRef, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { CalendarClock, Eye, EyeOff } from 'lucide-react'
import Alert from '../components/Alert'

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

function getPasswordStrength(password) {
  if (!password) return null
  const score = [
    password.length >= 8,
    /[a-zA-Z]/.test(password),
    /[0-9]/.test(password),
    /[^a-zA-Z0-9]/.test(password),
  ].filter(Boolean).length

  if (score <= 1) return { label: 'Muy débil',  bar: 'w-1/4  bg-danger-text' }
  if (score === 2) return { label: 'Débil',      bar: 'w-2/4  bg-warning-text' }
  if (score === 3) return { label: 'Buena',      bar: 'w-3/4  bg-yellow-400' }
  return              { label: 'Fuerte',      bar: 'w-full bg-success-text' }
}

export default function Register() {
  const navigate = useNavigate()
  const usernameRef = useRef(null)

  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' })
  const [error, setError]     = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword]               = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  useEffect(() => { usernameRef.current?.focus() }, [])

  const strength = getPasswordStrength(form.password)
  const passwordsMatch = form.confirmPassword === '' || form.password === form.confirmPassword

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
    if (error) setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!form.username.trim())          { setError('Por favor ingresa un nombre de usuario.'); return }
    if (form.password.length < 8)       { setError('La contraseña debe tener al menos 8 caracteres.'); return }
    if (form.password !== form.confirmPassword) { setError('Las contraseñas no coinciden.'); return }

    setLoading(true)
    try {
      await axios.post(`${API_URL}/api/users/register/`, {
        username: form.username, email: form.email, password: form.password,
      })
      setSuccess(true)
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      const msg = err.response?.data?.error
      setError(!err.response
        ? 'No se pudo conectar al servidor. Revisa tu conexión.'
        : msg || 'Error al crear la cuenta. Por favor intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const inputCls = 'w-full border border-[#E1E4E7] rounded-lg px-3 py-2.5 text-sm text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all'

  // UX #1 Estado: confirmación visual tras éxito
  if (success) {
    return (
      <div className="min-h-screen bg-app-bg flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-[#E1E4E7] w-full max-w-md text-center">
          <div className="w-14 h-14 bg-success-bg rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-success-text text-2xl font-bold">✓</span>
          </div>
          <h2 className="text-xl font-bold text-[#1A1A1A] mb-2">¡Cuenta creada!</h2>
          <p className="text-sm text-gray-500">Te redirigimos al inicio de sesión...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-app-bg font-sans">
      {/* UX #4 Consistencia: navbar igual al de Login */}
      <nav className="bg-brand px-8 py-3 flex items-center shadow-sm">
        <div className="font-bold text-base flex items-center gap-2 text-white select-none">
          <CalendarClock size={20} /> Gestión de Tareas
        </div>
      </nav>

      <div className="px-8 py-12 text-center">
        <h1 className="text-3xl font-bold text-[#1A1A1A] mb-2">Crear cuenta</h1>
        <p className="text-gray-500 mb-10">Completa los datos para registrarte</p>

        <div className="bg-white rounded-xl p-8 shadow-sm max-w-md mx-auto text-left border border-[#E1E4E7]">
          <Alert mensaje={error} type="danger" />

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5 mt-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-[#1A1A1A] mb-1">Usuario</label>
              <input ref={usernameRef} id="username" type="text" name="username"
                value={form.username} onChange={handleChange} autoComplete="username"
                placeholder="Elige un nombre de usuario" className={inputCls} />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#1A1A1A] mb-1">
                Email <span className="text-gray-400 font-normal">(opcional)</span>
              </label>
              <input id="email" type="email" name="email" value={form.email} onChange={handleChange}
                autoComplete="email" placeholder="tu@email.com" className={inputCls} />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#1A1A1A] mb-1">Contraseña</label>
              <div className="relative">
                <input id="password" type={showPassword ? 'text' : 'password'} name="password"
                  value={form.password} onChange={handleChange}
                  autoComplete="new-password" placeholder="Mínimo 8 caracteres"
                  className={`${inputCls} pr-10`} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand transition-colors"
                  aria-label={showPassword ? 'Ocultar' : 'Mostrar'}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {/* UX #10 Indicador de fortaleza */}
              {strength && (
                <div className="mt-2">
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${strength.bar}`} />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Fortaleza: <span className="font-medium">{strength.label}</span></p>
                </div>
              )}
              {/* UX #10 Requisitos siempre visibles */}
              <ul className="mt-2 text-xs space-y-0.5 list-none">
                <li className={form.password.length >= 8 ? 'text-success-text' : 'text-gray-400'}>
                  {form.password.length >= 8 ? '✓' : '○'} Al menos 8 caracteres
                </li>
                <li className={/[0-9]/.test(form.password) ? 'text-success-text' : 'text-gray-400'}>
                  {/[0-9]/.test(form.password) ? '✓' : '○'} Al menos un número
                </li>
                <li className={/[^a-zA-Z0-9]/.test(form.password) ? 'text-success-text' : 'text-gray-400'}>
                  {/[^a-zA-Z0-9]/.test(form.password) ? '✓' : '○'} Carácter especial (recomendado)
                </li>
              </ul>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#1A1A1A] mb-1">Confirmar contraseña</label>
              <div className="relative">
                <input id="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword"
                  value={form.confirmPassword} onChange={handleChange}
                  autoComplete="new-password" placeholder="Repite tu contraseña"
                  className={`${inputCls} pr-10 ${!passwordsMatch ? 'border-danger-border focus:ring-brand' : ''}`} />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand transition-colors"
                  aria-label={showConfirmPassword ? 'Ocultar' : 'Mostrar'}>
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {/* UX #5 Prevención en tiempo real */}
              {!passwordsMatch && <p className="text-xs text-danger-text mt-1">Las contraseñas no coinciden.</p>}
            </div>

            {/* UX #1 Spinner durante carga */}
            <button type="submit" disabled={loading || !passwordsMatch}
              className="bg-brand hover:bg-brand-hover text-white font-bold rounded-lg py-2.5 px-4 flex items-center justify-center gap-2 mt-1 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              {loading
                ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Registrando...</>
                : 'Crear cuenta'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="font-semibold text-brand hover:underline">Inicia sesión aquí</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
