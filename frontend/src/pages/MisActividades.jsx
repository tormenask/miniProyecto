import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { LayoutList, Loader2, Plus } from 'lucide-react'
import Navbar from '../components/Navbar'
import ErrorAlert from '../components/ErrorAlert'
import Toast from '../components/Toast'
import ActividadCard from '../components/ActividadCard'
import useActividades from '../hooks/useActividades'

function MisActividades() {
  const { actividades, cargando, error } = useActividades()
  const navigate = useNavigate()
  const location = useLocation()
  const [exito, setExito] = useState(location.state?.exito || null)

  return (
    <div className="min-h-screen bg-app-bg">
      <Toast mensaje={exito} duracion={2500} onClose={() => setExito(null)} />
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-10">

        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-[#1A1A1A] tracking-tight">Mis Actividades</h1>
            <p className="text-gray-500 mt-1">Organiza tus entregas y exámenes del semestre.</p>
          </div>
          <button
            onClick={() => navigate('/CrearActividad')}
            className="flex items-center justify-center gap-2 bg-brand hover:bg-brand-hover text-white px-6 py-3 rounded-xl font-bold transition-colors shadow-sm active:scale-95"
          >
            <Plus size={20} /> Nueva Actividad
          </button>
        </header>

        {cargando ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-[#E1E4E7] shadow-sm">
            <Loader2 className="animate-spin text-brand mb-4" size={40} />
            <p className="text-gray-500 animate-pulse">Cargando tus actividades...</p>
          </div>
        ) : error ? (
          <ErrorAlert mensaje={error} />
        ) : actividades.length === 0 ? (
          <div className="bg-white rounded-xl p-16 text-center shadow-sm border border-[#E1E4E7]">
            <div className="bg-danger-bg w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <LayoutList className="text-danger-text" size={36} />
            </div>
            <h3 className="text-xl font-bold text-[#1A1A1A]">No tienes actividades</h3>
            <p className="text-gray-500 mt-2 mb-8 max-w-sm mx-auto">
              Tu agenda está libre. Haz clic en el botón para agregar tu primera tarea.
            </p>
            <button onClick={() => navigate('/CrearActividad')}
              className="text-brand font-bold hover:underline transition-colors">
              + Crear mi primera actividad
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {actividades.map((act) => (
              <ActividadCard
                key={act.id}
                actividad={act}
                onClick={() => navigate(`/actividad/${act.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MisActividades
