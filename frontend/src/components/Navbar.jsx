import { useNavigate, useLocation } from 'react-router-dom'
import { CalendarClock, Home as HomeIcon, Sun, LayoutList, Plus, LogOut } from 'lucide-react'

function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()

  function handleLogout() {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('username')
    navigate('/login')
  }

  const navLinks = [
    { path: '/hoy', label: 'Hoy', icon: <Sun size={15} /> },
    { path: '/MisActividades', label: 'Actividades', icon: <LayoutList size={15} /> },
    { path: '/CrearActividad', label: 'Crear', icon: <Plus size={15} /> },
  ]

  return (
    <nav className="bg-brand px-8 py-3 flex items-center justify-between shadow-sm">
      <div
        className="font-bold text-base flex items-center gap-2 text-white cursor-pointer select-none"
        onClick={() => navigate('/MisActividades')}
      >
        <CalendarClock size={20} />
        Gestión de Actividades
      </div>

      <div className="flex items-center gap-1">
        {navLinks.map(({ path, label, icon }) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            className={`flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-lg transition-colors
              ${location.pathname === path
                ? 'bg-white/25 text-white'
                : 'text-white/75 hover:text-white hover:bg-white/15'
              }`}
          >
            {icon} {label}
          </button>
        ))}

        <div className="w-px h-5 bg-white/20 mx-2" />

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