import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { CalendarClock, Sun, LayoutList, Plus, LogOut, User, ChevronDown, UserCircle } from 'lucide-react'
import useProfile from '../hooks/useProfile'

function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const dropdownRef = useRef(null)
  const perfil = useProfile()

  const [dropdownAbierto, setDropdownAbierto] = useState(false)
  const [modalLogout, setModalLogout] = useState(false)

  const nombreMostrado = perfil
    ? ([perfil.first_name, perfil.last_name].filter(Boolean).join(' ').trim() || perfil.username)
    : (localStorage.getItem('username') || 'Usuario')

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownAbierto(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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
    <>
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
              type="button"
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

          {/* Dropdown de usuario */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setDropdownAbierto(prev => !prev)}
              className={`flex items-center gap-2 text-sm font-semibold px-3 py-1.5 rounded-lg transition-colors
                ${dropdownAbierto ? 'bg-white/25 text-white' : 'text-white/75 hover:text-white hover:bg-white/15'}`}
            >
              <UserCircle size={17} />
              <span className="max-w-[120px] truncate">{nombreMostrado}</span>
              <ChevronDown size={13} className={`transition-transform ${dropdownAbierto ? 'rotate-180' : ''}`} />
            </button>

            {dropdownAbierto && (
              <div className="absolute right-0 top-full mt-2 w-44 bg-white rounded-xl shadow-lg border border-[#E1E4E7] py-1 z-50">
                <button
                  type="button"
                  onClick={() => { setDropdownAbierto(false); navigate('/perfil') }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#1A1A1A] hover:bg-gray-50 transition-colors font-medium"
                >
                  <User size={15} className="text-gray-400" /> Ir a perfil
                </button>
                <div className="h-px bg-[#E1E4E7] mx-3 my-1" />
                <button
                  type="button"
                  onClick={() => { setDropdownAbierto(false); setModalLogout(true) }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-danger-text hover:bg-red-50 transition-colors font-medium"
                >
                  <LogOut size={15} /> Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Modal confirmación logout */}
      {modalLogout && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl shadow-xl border border-[#E1E4E7] w-full max-w-sm p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-red-50 rounded-full mx-auto mb-4">
              <LogOut size={22} className="text-danger-text" />
            </div>
            <h2 className="text-base font-bold text-[#1A1A1A] text-center mb-1">¿Cerrar sesión?</h2>
            <p className="text-sm text-gray-500 text-center mb-6">Tu sesión se cerrará y tendrás que volver a iniciar sesión.</p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setModalLogout(false)}
                className="flex-1 py-2.5 rounded-lg border border-[#E1E4E7] text-gray-600 text-sm font-bold hover:border-gray-300 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="flex-1 py-2.5 rounded-lg bg-danger-text hover:opacity-90 text-white text-sm font-bold transition-colors"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Navbar
