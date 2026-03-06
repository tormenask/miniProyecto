import { useEffect, useState } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { ArrowLeft, Pencil, Trash2, Loader2, Calendar, BookOpen, Clock } from 'lucide-react'
import Navbar from '../components/Navbar'
import ErrorAlert from '../components/ErrorAlert'
import Toast from '../components/Toast'
import SubtareaList from '../components/SubtareaList'
import Modal from '../components/Modal'
import useActividad from '../hooks/useActividad'
import useSubtareas from '../hooks/useSubtareas'

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

const TIPO_LABELS = { exam: 'Examen', quiz: 'Quiz', workshop: 'Taller', project: 'Proyecto', other: 'Otro' }
// Badges con paleta del design system
const TIPO_COLORS = {
  exam:     'bg-danger-bg text-danger-text',
  quiz:     'bg-warning-bg text-warning-text',
  workshop: 'bg-blue-50 text-blue-700',
  project:  'bg-purple-50 text-purple-700',
  other:    'bg-card-head text-gray-600',
}

function DetalleActividad() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { actividad, cargando, error } = useActividad(id)
  const { subtareas, setSubtareas, guardando, agregar, eliminar, toggle } = useSubtareas(id)
  const [eliminando, setEliminando]       = useState(false)
  const [modalEliminar, setModalEliminar] = useState(false)
  const [errorAccion, setErrorAccion]     = useState(null)
  const [exito, setExito]                 = useState(location.state?.exito || null)

  const from      = location.state?.from || '/MisActividades'
  const fromLabel = from === '/hoy' ? 'Volver a Hoy' : 'Volver a mis actividades'

  const token   = localStorage.getItem('access_token')
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }

  useEffect(() => {
    if (!id) return
    const cargarSubs = async () => {
      const res = await fetch(`${API_URL}/api/activities/${id}/subtasks/`, { headers })
      if (res.ok) setSubtareas(await res.json())
    }
    cargarSubs()
  }, [id])

  const handleEliminar = async () => {
    setEliminando(true)
    try {
      const res = await fetch(`${API_URL}/api/activities/${id}/`, { method: 'DELETE', headers })
      if (!res.ok) throw new Error('Error al eliminar la actividad.')
      navigate(from, { state: { exito: 'Actividad eliminada correctamente.' } })
    } catch (err) {
      setErrorAccion(err.message)
      setEliminando(false)
      setModalEliminar(false)
    }
  }

  if (cargando) {
    return (
      <div className="min-h-screen bg-app-bg">
        <Navbar />
        <div className="max-w-3xl mx-auto px-6 py-10">
          <div className="h-4 bg-gray-200 rounded w-48 mb-6 animate-pulse" />

          {/* Card principal skeleton */}
          <div className="bg-white rounded-xl shadow-sm border border-[#E1E4E7] p-8 mb-6 animate-pulse">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div className="flex-1 space-y-3">
                <div className="h-6 bg-gray-100 rounded-full w-20" />
                <div className="h-7 bg-gray-200 rounded w-2/3" />
                <div className="h-4 bg-gray-100 rounded w-40" />
              </div>
              <div className="flex gap-2 shrink-0">
                <div className="h-9 w-20 bg-gray-100 rounded-lg" />
                <div className="h-9 w-24 bg-gray-100 rounded-lg" />
              </div>
            </div>
            <div className="h-14 bg-gray-50 rounded-xl mb-6" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="h-16 bg-blue-50 rounded-xl" />
              <div className="h-16 bg-red-50 rounded-xl" />
            </div>
          </div>

          {/* Subactividades skeleton */}
          <div className="bg-white rounded-xl shadow-sm border border-[#E1E4E7] p-6 animate-pulse">
            <div className="flex items-center justify-between mb-5">
              <div className="h-5 bg-gray-200 rounded w-32" />
              <div className="h-9 w-24 bg-gray-100 rounded-lg" />
            </div>
            <div className="space-y-3">
              {[0, 1].map((i) => (
                <div key={i} className="h-12 bg-gray-50 rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-app-bg">
        <Navbar />
        <div className="max-w-2xl mx-auto px-6 py-10">
          <ErrorAlert mensaje={error} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-app-bg">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-10">

        <button onClick={() => navigate(from)}
          className="flex items-center text-gray-400 hover:text-brand mb-6 transition-colors text-sm">
          <ArrowLeft size={16} className="mr-2" />
          {fromLabel}
        </button>

        <Toast mensaje={exito} duracion={2500} onClose={() => setExito(null)} />
        <ErrorAlert mensaje={errorAccion} />

        {/* Card principal */}
        <div className="bg-white rounded-xl shadow-sm border border-[#E1E4E7] p-8 mb-6">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className={`text-xs font-bold uppercase px-3 py-1 rounded-full tracking-wider ${TIPO_COLORS[actividad.tipo]}`}>
                  {TIPO_LABELS[actividad.tipo]}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-[#1A1A1A]">{actividad.titulo}</h1>
              <div className="flex items-center gap-2 mt-2 text-gray-500 text-sm">
                <BookOpen size={14} />
                <span>{actividad.curso}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* Botón secundario: borde #E1E4E7 */}
              <button onClick={() => navigate(`/actividad/${id}/editar`, { state: { from } })}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#E1E4E7] text-gray-600 hover:border-brand hover:text-brand transition-all text-sm font-semibold">
                <Pencil size={15} /> Editar
              </button>
              {/* Eliminar → abre modal de confirmación */}
              <button onClick={() => setModalEliminar(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-danger-border text-danger-text hover:bg-danger-bg transition-all text-sm font-semibold">
                <Trash2 size={15} /> Eliminar
              </button>
            </div>
          </div>

          {actividad.descripcion && (
            <p className="text-gray-600 text-sm leading-relaxed bg-app-bg rounded-xl px-4 py-3 mb-6">
              {actividad.descripcion}
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {actividad.fecha_evento && (
              <div className="flex items-center gap-3 bg-blue-50 rounded-xl px-4 py-3">
                <Calendar size={18} className="text-blue-500 shrink-0" />
                <div>
                  <p className="text-[10px] uppercase font-black text-blue-400 tracking-widest">Fecha del evento</p>
                  <p className="text-sm font-bold text-blue-800">
                    {new Date(actividad.fecha_evento).toLocaleString('es-ES', {
                      timeZone: 'America/Bogota', weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            )}
            {actividad.fecha_limite && (
              <div className="flex items-center gap-3 bg-danger-bg rounded-xl px-4 py-3">
                <Clock size={18} className="text-danger-text shrink-0" />
                <div>
                  <p className="text-[10px] uppercase font-black text-danger-text tracking-widest">Fecha límite</p>
                  <p className="text-sm font-bold text-danger-text">
                    {new Date(actividad.fecha_limite).toLocaleString('es-ES', {
                      timeZone: 'America/Bogota', weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <SubtareaList
          subtareas={subtareas}
          onAgregar={agregar}
          onToggle={toggle}
          onEliminar={eliminar}
          guardando={guardando}
          fechaEvento={actividad.fecha_evento}
          fechaLimite={actividad.fecha_limite}
        />
      </div>

      {/* Modal de confirmación de eliminación */}
      <Modal open={modalEliminar} onClose={() => setModalEliminar(false)} title="Eliminar actividad">
        <div className="space-y-4">
          <div className="flex items-start gap-3 bg-danger-bg border border-danger-border rounded-lg px-4 py-3">
            <Trash2 size={18} className="text-danger-text shrink-0 mt-0.5" />
            <p className="text-sm text-danger-text font-medium">
              Esta acción no se puede deshacer. Se eliminará la actividad <strong>"{actividad.titulo}"</strong> y todas sus subactividades.
            </p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setModalEliminar(false)}
              className="flex-1 py-2.5 rounded-lg border border-[#E1E4E7] text-gray-600 font-semibold text-sm hover:border-gray-400 transition-colors">
              Cancelar
            </button>
            <button onClick={handleEliminar} disabled={eliminando}
              className="flex-1 bg-danger-text text-white py-2.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-60 transition-opacity">
              {eliminando ? <Loader2 className="animate-spin" size={16} /> : <Trash2 size={16} />}
              {eliminando ? 'Eliminando...' : 'Sí, eliminar'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default DetalleActividad
