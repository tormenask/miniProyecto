import { useState, useRef, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { LogIn, Eye, EyeOff, AlertCircle, Loader } from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

export default function Login() {
  const navigate = useNavigate()
  const usernameRef = useRef(null)

  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    usernameRef.current?.focus()
  }, [])

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
    if (error) setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

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
      const response = await axios.post(`${API_URL}/api/auth/login/`, {
        username: form.username,
        password: form.password,
      })

      localStorage.setItem('access_token', response.data.access)
      localStorage.setItem('refresh_token', response.data.refresh)
      localStorage.setItem('username', form.username)

      navigate('/home')
    } catch (err) {
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
    <div className="min-h-screen bg-gray-100 font-sans">

      {/* Navbar */}
      <nav className="bg-white px-8 py-3 flex items-center justify-between border-b border-gray-200">
        <div className="font-bold text-base flex items-center gap-2">
          <LogIn size={20} /> Gestión de Tareas
        </div>
      </nav>

      {/* Contenido */}
      <div className="px-8 py-12 text-center">
        <h1 className="text-3xl font-bold mb-2">Iniciar sesión</h1>
        <p className="text-gray-500 mb-10">Ingresa tus datos para continuar</p>

        <div className="bg-white rounded-xl p-8 shadow-sm max-w-md mx-auto text-left">

          {error && (
            <div role="alert" className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-6 text-sm flex items-start gap-2">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">

            <div>
              <label htmlFor="username" className="block text-sm font-medium mb-1">Usuario</label>
              <input
                ref={usernameRef}
                id="username"
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                autoComplete="username"
                placeholder="Tu nombre de usuario"
                className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">Contraseña</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  placeholder="Tu contraseña"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-black text-white font-bold rounded-lg py-3 px-4 flex items-center justify-center gap-2 w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <><Loader size={16} className="animate-spin" /> Ingresando...</>
              ) : (
                'Ingresar'
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="font-semibold underline text-black">
              Regístrate aquí
            </Link>
          </p>

        </div>
      </div>
    </div>
  )
}