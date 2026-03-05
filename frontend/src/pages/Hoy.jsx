<<<<<<< HEAD
<<<<<<< Updated upstream
// Página principal de la aplicación, visible luego de iniciar sesión.
// Muestra un mensaje de bienvenida personalizado con el nombre del usuario.
=======
// Página principal tras el login.
// Muestra bienvenida personalizada con nombre del usuario.
>>>>>>> main
import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'

function Hoy() {
  const [username, setUsername]       = useState('')
  const [showWelcome, setShowWelcome] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('username')
    if (stored) setUsername(stored)
    // UX #1 Visibilidad: banner desaparece solo después de 4 s
    const timer = setTimeout(() => setShowWelcome(false), 4000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-app-bg">
      <Navbar />

      {/* Banner de bienvenida con color brand */}
      {showWelcome && (
        <div className="bg-brand text-white px-6 py-3 flex items-center justify-between">
          <p className="text-sm font-medium">
            ¡Bienvenido{username ? `, ${username}` : ''}! 👋 Hoy es un gran día para ser productivo.
          </p>
          {/* UX #3 Control: cerrar manualmente */}
          <button
            onClick={() => setShowWelcome(false)}
            className="ml-4 text-white/70 hover:text-white text-lg leading-none shrink-0"
            aria-label="Cerrar bienvenida"
          >
            ✕
          </button>
        </div>
      )}

      <main className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-[#1A1A1A] mb-2">Hoy</h1>
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