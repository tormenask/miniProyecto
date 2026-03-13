import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { LayoutList, Plus } from 'lucide-react'
import Navbar from '../components/Navbar'
import Alert from '../components/Alert'
import Toast from '../components/Toast'
import ActividadCard from '../components/ActividadCard'
import useActividades from '../hooks/useActividades'
import useLimiteHoras from '../hooks/useLimiteHoras'
import Select from '../components/Select'
import { CURSOS } from '../utils/cursos'
import { actividadTieneConflicto } from '../utils/horasUtils'

const TIPOS_FILTRO = [
  { value: '', label: 'Todos los tipos' },
  { value: 'exam', label: 'Examen' },
  { value: 'quiz', label: 'Quiz' },
  { value: 'workshop', label: 'Taller' },
  { value: 'project', label: 'Proyecto' },
  { value: 'other', label: 'Otro' },
]

const CURSOS_FILTRO = [
  { value: '', label: 'Todos los cursos' },
  ...CURSOS,
]

function MisActividades() {
  const { actividades, cargando, error } = useActividades()
  const { limite } = useLimiteHoras()
  const navigate = useNavigate()
  const location = useLocation()
  const [exito, setExito] = useState(location.state?.exito || null)
  const [filtroTipo, setFiltroTipo] = useState('')
  const [filtroCurso, setFiltroCurso] = useState('')

  const actividadesFiltradas = actividades.filter((act) => {
    if (filtroTipo && act.tipo !== filtroTipo) return false
    if (filtroCurso && act.curso !== filtroCurso) return false
    return true
  })

  const totalSubs = actividades.reduce((acc, a) => acc + (a.subactivities?.length || 0), 0)
  const completadas = actividades.reduce((acc, a) => acc + (a.subactivities?.filter(s => s.estado === 'hecha' || s.completada).length || 0), 0)
  const pendientes = totalSubs - completadas

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

        {/* Resumen general */}
        {!cargando && !error && actividades.length > 0 && (
          <div className="bg-red-50 border border-red-100 rounded-xl p-6 mb-6 grid grid-cols-3 text-center">
            <div>
              <p className="text-3xl font-black text-brand">{actividades.length}</p>
              <p className="text-xs text-gray-500 mt-1">Actividades totales</p>
            </div>
            <div>
              <p className="text-3xl font-black text-green-500">{completadas}</p>
              <p className="text-xs text-gray-500 mt-1">Subtareas completadas</p>
            </div>
            <div>
              <p className="text-3xl font-black text-gray-400">{pendientes}</p>
              <p className="text-xs text-gray-500 mt-1">Subtareas pendientes</p>
            </div>
          </div>
        )}

        {/* Filtros */}
        {cargando ? (
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="w-44 h-10 bg-gray-200 rounded-lg animate-pulse" />
            <div className="w-56 h-10 bg-gray-200 rounded-lg animate-pulse" />
          </div>
        ) : !error && actividades.length > 0 && (
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <Select
              name="filtroTipo"
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
              options={TIPOS_FILTRO}
              className="w-44"
            />
            <Select
              name="filtroCurso"
              value={filtroCurso}
              onChange={(e) => setFiltroCurso(e.target.value)}
              options={CURSOS_FILTRO}
              className="w-56"
            />
            {(filtroTipo || filtroCurso) && (
              <button
                onClick={() => { setFiltroTipo(''); setFiltroCurso('') }}
                className="px-3 py-2 text-sm text-gray-500 border border-[#E1E4E7] rounded-lg hover:border-gray-400 transition-colors"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        )}

        {/* Contenido */}
        {cargando ? (
          <div className="grid gap-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="bg-white p-5 rounded-xl shadow-sm border border-[#E1E4E7] animate-pulse flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl shrink-0" />
                  <div className="space-y-2.5">
                    <div className="h-3.5 bg-gray-200 rounded w-48" />
                    <div className="flex items-center gap-2">
                      <div className="h-2.5 bg-gray-100 rounded w-24" />
                      <div className="h-4 bg-gray-100 rounded w-14" />
                    </div>
                    <div className="h-5 bg-gray-100 rounded w-20" />
                  </div>
                </div>
                <div className="w-5 h-5 bg-gray-100 rounded shrink-0" />
              </div>
            ))}
          </div>
        ) : error ? (
          <Alert mensaje={error} />
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
        ) : actividadesFiltradas.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-[#E1E4E7]">
            <p className="text-gray-500">No hay actividades que coincidan con los filtros seleccionados.</p>
            <button onClick={() => { setFiltroTipo(''); setFiltroCurso('') }}
              className="text-brand font-bold hover:underline mt-3 block mx-auto transition-colors">
              Limpiar filtros
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {actividadesFiltradas.map((act) => (
              <ActividadCard
                key={act.id}
                actividad={act}
                tieneConflicto={actividadTieneConflicto(act, actividades, limite)}
                onClick={() => navigate(`/actividad/${act.id}`, { state: { from: '/MisActividades' } })}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MisActividades