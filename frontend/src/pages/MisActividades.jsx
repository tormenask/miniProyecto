import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { LayoutList, Plus, BookOpen, SlidersHorizontal, X, ChevronDown } from 'lucide-react'
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

const CURSOS_FILTRO = [{ value: '', label: 'Todos los cursos' }, ...CURSOS]

/* ─── Pill de tipo ───────────────────────────────────────── */
function TipoPill({ tipo, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`
        inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium
        border transition-all duration-200 select-none whitespace-nowrap
        ${active
          ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-md scale-[1.03]'
          : 'bg-white text-gray-600 border-[#E1E4E7] hover:border-gray-400 hover:bg-gray-50'
        }
      `}
    >
      <span className="text-base leading-none">{tipo.emoji}</span>
      {tipo.label}
    </button>
  )
}

/* ─── Select estilizado ──────────────────────────────────── */
function CursoSelect({ value, onChange, options }) {
  return (
    <div className="relative">
      <BookOpen
        size={15}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
      />
      <select
        value={value}
        onChange={onChange}
        className="
          appearance-none pl-8 pr-8 py-1.5 rounded-full text-sm font-medium
          bg-white border border-[#E1E4E7] text-gray-600
          hover:border-gray-400 focus:outline-none focus:border-[#1A1A1A]
          transition-all duration-200 cursor-pointer
        "
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <ChevronDown
        size={13}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
      />
    </div>
  )
}

/* ─── Chip de filtro activo ──────────────────────────────── */
function ActiveChip({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full text-xs font-semibold">
      {label}
      <button onClick={onRemove} className="hover:text-indigo-900 transition-colors">
        <X size={11} strokeWidth={2.5} />
      </button>
    </span>
  )
}

/* ─── Barra de filtros principal ─────────────────────────── */
function FilterBar({ filtroTipo, setFiltroTipo, filtroCurso, setFiltroCurso, total, filtrado }) {
  const [open, setOpen] = useState(true)
  const hayFiltros = filtroTipo || filtroCurso
  const cursoLabel = CURSOS_FILTRO.find(c => c.value === filtroCurso)?.label
  const tipoLabel  = TIPOS_FILTRO.find(t => t.value === filtroTipo)?.label

  return (
    <div className="mb-6 space-y-2">
      {/* Cabecera de filtros */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setOpen(v => !v)}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors select-none"
        >
          <SlidersHorizontal size={14} />
          <span className="font-medium">Filtros</span>
          <ChevronDown
            size={13}
            className={`transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
          />
        </button>

        <div className="flex items-center gap-2">
          {/* Chips de filtros activos */}
          {tipoLabel  && <ActiveChip label={tipoLabel}  onRemove={() => setFiltroTipo('')} />}
          {cursoLabel && filtroCurso && <ActiveChip label={cursoLabel} onRemove={() => setFiltroCurso('')} />}

          {hayFiltros && (
            <button
              onClick={() => { setFiltroTipo(''); setFiltroCurso('') }}
              className="text-xs text-gray-400 hover:text-red-500 transition-colors font-medium underline underline-offset-2"
            >
              Limpiar todo
            </button>
          )}

          {/* Contador */}
          <span className="ml-1 text-xs text-gray-400">
            {hayFiltros ? `${filtrado} de ${total}` : `${total} actividades`}
          </span>
        </div>
      </div>

      {/* Panel colapsable */}
      <div
        className={`
          overflow-hidden transition-all duration-300 ease-in-out
          ${open ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}
        `}
      >
        <div className="bg-white border border-[#E1E4E7] rounded-2xl px-4 py-3 flex flex-wrap items-center gap-2 shadow-xs">
          {/* Pills de tipo */}
          <div className="flex flex-wrap gap-2 items-center">
            {TIPOS_FILTRO.map((t) => (
              <TipoPill
                key={t.value}
                tipo={t}
                active={filtroTipo === t.value}
                onClick={() => setFiltroTipo(filtroTipo === t.value ? '' : t.value)}
              />
            ))}
          </div>

          {/* Divisor vertical */}
          <div className="hidden md:block w-px h-6 bg-[#E1E4E7] mx-1" />

          {/* Select de curso */}
          <CursoSelect
            value={filtroCurso}
            onChange={(e) => setFiltroCurso(e.target.value)}
            options={CURSOS_FILTRO}
          />
        </div>
      </div>
    </div>
  )
}

/* ─── Vista principal ────────────────────────────────────── */
function MisActividades() {
  const { actividades, cargando, error } = useActividades()
  const { limite } = useLimiteHoras()
  const navigate = useNavigate()
  const location = useLocation()
  const [exito, setExito]       = useState(location.state?.exito || null)
  const [filtroTipo, setFiltroTipo]   = useState('')
  const [filtroCurso, setFiltroCurso] = useState('')

  const actividadesFiltradas = actividades.filter((act) => {
    if (filtroTipo  && act.tipo  !== filtroTipo)  return false
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
          <div className="mb-6 space-y-2">
            {/* Cabecera skeleton */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 bg-gray-200 rounded animate-pulse" />
                <div className="w-12 h-3.5 bg-gray-200 rounded animate-pulse" />
                <div className="w-3 h-3 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="w-24 h-3.5 bg-gray-100 rounded animate-pulse" />
            </div>
            {/* Panel skeleton */}
            <div className="bg-white border border-[#E1E4E7] rounded-2xl px-4 py-3 flex flex-wrap items-center gap-2">
              {/* Pills de tipo */}
              {[72, 56, 64, 76, 48].map((w, i) => (
                <div
                  key={i}
                  className="h-8 bg-gray-100 rounded-full animate-pulse"
                  style={{ width: `${w}px`, animationDelay: `${i * 60}ms` }}
                />
              ))}
              {/* Divisor */}
              <div className="hidden md:block w-px h-6 bg-[#E1E4E7] mx-1" />
              {/* Select curso */}
              <div className="h-8 w-40 bg-gray-100 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        ) : !error && actividades.length > 0 && (
          <FilterBar
            filtroTipo={filtroTipo}   setFiltroTipo={setFiltroTipo}
            filtroCurso={filtroCurso} setFiltroCurso={setFiltroCurso}
            total={actividades.length}
            filtrado={actividadesFiltradas.length}
          />
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
