import { useState, useRef, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { CalendarClock, Eye, EyeOff, Loader } from 'lucide-react'
import Alert from '../components/Alert'

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

export default function Login() {
  const navigate = useNavigate()
  const usernameRef = useRef(null)
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // UX #7 Eficiencia: autofocus al cargar
  useEffect(() => { usernameRef.current?.focus() }, [])

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
    if (error) setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    // UX #5 Prevención de errores: validación local antes de enviar
    if (!form.username.trim()) { setError('Por favor ingresa tu nombre de usuario.'); return }
    if (!form.password) { setError('Por favor ingresa tu contraseña.'); return }

    setLoading(true)
    try {
      const response = await axios.post(`${API_URL}/api/auth/login/`, {
        username: form.username,
        password: form.password,
      })
      localStorage.setItem('access_token', response.data.access)
      localStorage.setItem('refresh_token', response.data.refresh)
      localStorage.setItem('username', form.username)
      navigate('/home')
    } catch (err) {
      // UX #9 Recuperación: mensajes específicos por tipo de error
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

  const inputCls = 'w-full border border-[#E1E4E7] rounded-lg px-4 py-2.5 text-sm text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-brand transition-all'

  return (
    // UX #8 Minimalismo: fondo app-bg, tarjeta centrada
    <div className="min-h-screen bg-app-bg font-sans">
      {/* UX #4 Consistencia: mini navbar brand igual al de las páginas autenticadas */}
      <nav className="bg-brand px-8 py-3 flex items-center shadow-sm">
        <div className="font-bold text-base flex items-center gap-2 text-white select-none">
          <CalendarClock size={20} /> Gestión de Tareas
        </div>
      </nav>

      <div className="px-8 py-12 text-center">
        {/* UX #2 Mundo real: encabezado claro */}
        <h1 className="text-3xl font-bold text-[#1A1A1A] mb-2">Iniciar sesión</h1>
        <p className="text-gray-500 mb-10">Ingresa tus datos para continuar</p>

        <div className="bg-white rounded-xl p-8 shadow-sm max-w-md mx-auto text-left border border-[#E1E4E7]">
          {/* UX #9 Recuperación: alerta danger unificada */}
          <Alert mensaje={error} type="danger" />

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5 mt-4">
            {/* UX #6 Reconocimiento: label siempre visible */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-[#1A1A1A] mb-1">Usuario</label>
              <input
                ref={usernameRef} id="username" type="text" name="username"
                value={form.username} onChange={handleChange}
                autoComplete="username" placeholder="Tu nombre de usuario"
                className={inputCls}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#1A1A1A] mb-1">Contraseña</label>
              {/* UX #3 Control: mostrar/ocultar contraseña */}
              <div className="relative">
                <input
                  id="password" type={showPassword ? 'text' : 'password'} name="password"
                  value={form.password} onChange={handleChange}
                  autoComplete="current-password" placeholder="Tu contraseña"
                  className={`${inputCls} pr-10`}
                />
                <button
                  type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand transition-colors"
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* UX #1 Visibilidad del estado: spinner durante la petición */}
            <button
              type="submit" disabled={loading}
              className="bg-brand hover:bg-brand-hover text-white font-bold rounded-lg py-3 px-4 flex items-center justify-center gap-2 w-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? <><Loader size={16} className="animate-spin" /> Ingresando...</> : 'Ingresar'}
            </button>
          </form>

          {/* UX #10 Documentación: guía hacia registro */}
          <p className="text-center text-sm text-gray-500 mt-6">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="font-semibold text-brand hover:underline">Regístrate aquí</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
