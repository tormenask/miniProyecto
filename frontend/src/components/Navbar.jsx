// Navbar principal de la aplicación.
// UX #4 Consistencia: aparece igual en todas las páginas autenticadas.
// Color primario #CD1F32 con texto/iconos blancos para máximo contraste.
import { useNavigate } from 'react-router-dom'
import { CalendarClock, Home as HomeIcon, LogOut } from 'lucide-react'

function Navbar() {
  const navigate = useNavigate()

  function handleLogout() {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('username')
    navigate('/login')
  }

  return (
    <nav className="bg-brand px-8 py-3 flex items-center justify-between shadow-sm">
      {/* Logo: clic navega al inicio */}
      <div
        className="font-bold text-base flex items-center gap-2 text-white cursor-pointer select-none"
        onClick={() => navigate('/home')}
      >
        <CalendarClock size={20} />
        Gestión de Actividades
      </div>

      {/* Acciones de navegación y sesión */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/home')}
          className="flex items-center gap-2 text-white/80 hover:text-white text-sm font-semibold transition-colors"
        >
          <HomeIcon size={16} /> Inicio
        </button>

        {/* UX #3 Control y libertad: logout siempre accesible */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white text-sm font-semibold px-3 py-1.5 rounded-lg transition-colors"
        >
          <LogOut size={15} /> Salir
        </button>
      </div>
    </nav>
  )
}

export default Navbar
