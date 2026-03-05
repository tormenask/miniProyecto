<<<<<<< Updated upstream
// Página principal de la aplicación, visible luego de iniciar sesión.
// Muestra un mensaje de bienvenida personalizado con el nombre del usuario.
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Hoy() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [showWelcome, setShowWelcome] = useState(true)

  useEffect(() => {
    // Recupera el nombre de usuario guardado en localStorage durante el login.
    const stored = localStorage.getItem('username')
    if (stored) setUsername(stored)

    // El banner de bienvenida se oculta automáticamente después de 4 segundos.
    const timer = setTimeout(() => setShowWelcome(false), 4000)
    return () => clearTimeout(timer)
  }, [])

  function handleLogout() {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('username')
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Banner de bienvenida personalizado con el nombre del usuario */}
      {showWelcome && (
        <div className="bg-blue-600 text-white px-6 py-4 flex items-center justify-between shadow-sm">
          <p className="font-medium text-sm sm:text-base">
            ¡Bienvenido{username ? `, ${username}` : ''}! 👋 Hoy es un gran día para ser productivo.
          </p>
          <button
            onClick={() => setShowWelcome(false)}
            className="ml-4 text-blue-200 hover:text-white text-lg leading-none shrink-0"
            aria-label="Cerrar mensaje de bienvenida"
          >
            ✕
          </button>
        </div>
      )}

      {/* Encabezado de la página */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">Hoy</h1>
        <button
          onClick={handleLogout}
          className="text-sm text-gray-500 hover:text-red-600 transition-colors"
        >
          Cerrar sesión
        </button>
      </header>

      {/* Contenido principal */}
      <main className="max-w-4xl mx-auto p-6">
        <p className="text-gray-400 text-sm">Aquí verás tus actividades de hoy.</p>
      </main>
=======
import Navbar from "../components/Navbar"
import TodayView from "../components/hoy/TodayView"
import useHoy from "../hooks/useHoy"

function Hoy() {
  const { tasks, loading, error, fetchTasks } = useHoy()

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Vista de Hoy</h1>
        <p className="text-sm text-gray-500 mb-8">
          {new Date().toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" })}
        </p>
        <TodayView loading={loading} error={error} tasks={tasks} retryFetch={fetchTasks} />
      </div>
>>>>>>> Stashed changes
    </div>
  )
}

export default Hoy