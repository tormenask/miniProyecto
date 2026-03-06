import { useState, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { LayoutList, Calendar, ChevronRight, Loader2, Clock, BookOpen, Plus, Search, Filter, X } from 'lucide-react'
import Navbar from '../components/Navbar'
import ErrorAlert from '../components/ErrorAlert'
import Toast from '../components/Toast'
import useActividades from '../hooks/useActividades'
import { useRef, useEffect } from 'react'

// ─── Constantes de filtro ─────────────────────────────────────────────────────
const TIPOS = [
  { value: 'all',          label: 'Todos los tipos' },
  { value: 'exam',         label: 'Examen' },
  { value: 'quiz',         label: 'Quiz' },
  { value: 'workshop',     label: 'Taller' },
  { value: 'project',      label: 'Proyecto' },
  { value: 'presentation', label: 'Presentación' },
  { value: 'other',        label: 'Otro' },
]

const ESTADOS = [
  { value: 'all',       label: 'Todos los estados' },
  { value: 'pending',   label: 'Pendiente' },
  { value: 'done',      label: 'Hecho' },
  { value: 'postponed', label: 'Pospuesto' },
]

const ORDEN = [
  { value: 'reciente',    label: 'Más recientes' },
  { value: 'antigua',     label: 'Más antiguas' },
  { value: 'limite_asc',  label: 'Fecha límite ↑' },
  { value: 'limite_desc', label: 'Fecha límite ↓' },
]

// ─── Dropdown personalizado ───────────────────────────────────────────────────
function CustomDropdown({ options, value, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function handler(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const selected = options.find(o => o.value === value) ?? options[0]

  return (
    <div className="relative flex-1" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-2 border border-[#E1E4E7]
          rounded-xl px-3.5 py-2.5 bg-white text-sm hover:border-gray-300 transition-colors"
      >
        <span className={value === 'all' ? 'text-gray-400' : 'text-[#1A1A1A] font-medium'}>
          {selected.label}
        </span>
        <svg className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1 w-full bg-white rounded-xl border
          border-[#E1E4E7] shadow-lg z-30 overflow-hidden">
          {options.map((opt, i) => {
            const isSelected = opt.value === value
            return (
              <button key={opt.value} type="button"
                onClick={() => { onChange(opt.value); setOpen(false) }}
                className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors
                  ${i !== 0 ? 'border-t border-gray-100' : ''}
                  ${isSelected ? 'text-brand font-medium bg-danger-bg' : 'text-gray-700 hover:bg-app-bg'}`}
              >
                <span>{opt.label}</span>
                {isSelected && (
                  <svg className="w-4 h-4 text-brand shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ─── Panel de filtros ─────────────────────────────────────────────────────────
function PanelFiltros({ actividades, filtros, setFiltros }) {
  const materias = [
    { value: 'all', label: 'Todas las materias' },
    ...[...new Set(actividades.map(a => a.curso).filter(Boolean))].sort().map(m => ({ value: m, label: m })),
  ]

  const hayFiltros = filtros.busqueda || filtros.tipo !== 'all' ||
    filtros.estado !== 'all' || filtros.materia !== 'all' || filtros.orden !== 'reciente'

  function limpiar() {
    setFiltros({ busqueda: '', tipo: 'all', estado: 'all', materia: 'all', orden: 'reciente' })
  }

  return (
    <div className="bg-white rounded-xl border border-[#E1E4E7] shadow-sm p-5 mb-6">

      {/* Encabezado */}
      <div className="flex items-center justify-between mb-0.5">
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-brand" />
          <span className="text-sm font-bold text-[#1A1A1A]">Filtrar tareas</span>
        </div>
        {hayFiltros && (
          <button type="button" onClick={limpiar}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-danger-text transition-colors">
            <X size={12} /> Limpiar
          </button>
        )}
      </div>
      <p className="text-xs text-gray-400 mb-4">Enfócate en lo que necesitas ver ahora</p>

      {/* Buscador */}
      <div className="relative mb-3">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" />
        <input
          type="text"
          value={filtros.busqueda}
          onChange={e => setFiltros(f => ({ ...f, busqueda: e.target.value }))}
          placeholder="Buscar por título o materia…"
          className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-[#E1E4E7] bg-app-bg
            text-sm text-[#1A1A1A] placeholder-gray-300
            focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand/40 transition-all"
        />
        {filtros.busqueda && (
          <button type="button" onClick={() => setFiltros(f => ({ ...f, busqueda: '' }))}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500">
            <X size={13} />
          </button>
        )}
      </div>

      {/* Materia + Estado */}
      <div className="flex gap-3 mb-3">
        <CustomDropdown options={materias}      value={filtros.materia} onChange={val => setFiltros(f => ({ ...f, materia: val }))} />
        <CustomDropdown options={ESTADOS}       value={filtros.estado}  onChange={val => setFiltros(f => ({ ...f, estado: val }))} />
      </div>

      {/* Chips de tipo */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {TIPOS.map(t => (
          <button key={t.value} type="button"
            onClick={() => setFiltros(f => ({ ...f, tipo: t.value }))}
            className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors
              ${filtros.tipo === t.value
                ? 'bg-brand text-white border-brand'
                : 'bg-white text-gray-500 border-[#E1E4E7] hover:border-brand/40 hover:text-brand'
              }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Ordenar */}
      <div className="flex items-center gap-2 pt-3 border-t border-[#E1E4E7] flex-wrap">
        <span className="text-xs text-gray-400 shrink-0">Ordenar por</span>
        {ORDEN.map(o => (
          <button key={o.value} type="button"
            onClick={() => setFiltros(f => ({ ...f, orden: o.value }))}
            className={`text-xs px-2.5 py-1 rounded-lg border transition-colors
              ${filtros.orden === o.value
                ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                : 'bg-white text-gray-500 border-[#E1E4E7] hover:border-gray-400'
              }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Página principal ─────────────────────────────────────────────────────────
function MisActividades() {
  const { actividades, cargando, error } = useActividades()
  const navigate = useNavigate()
  const location = useLocation()
  const [exito, setExito] = useState(location.state?.exito || null)

  // ── Filtros ──────────────────────────────────────────────────────────────────
  const [filtros, setFiltros] = useState({
    busqueda: '', tipo: 'all', estado: 'all', materia: 'all', orden: 'reciente'
  })

  const filtradas = useMemo(() => {
    let result = [...actividades]

    if (filtros.busqueda.trim()) {
      const q = filtros.busqueda.toLowerCase()
      result = result.filter(a =>
        a.titulo?.toLowerCase().includes(q) || a.curso?.toLowerCase().includes(q)
      )
    }
    if (filtros.tipo    !== 'all') result = result.filter(a => a.tipo === filtros.tipo)
    if (filtros.materia !== 'all') result = result.filter(a => a.curso === filtros.materia)
    if (filtros.estado  !== 'all') {
      result = result.filter(a =>
        (a.subtareas ?? a.subtasks ?? []).some(s => (s.estado ?? s.status) === filtros.estado)
      )
    }

    result.sort((a, b) => {
      if (filtros.orden === 'reciente')    return new Date(b.fecha_creacion) - new Date(a.fecha_creacion)
      if (filtros.orden === 'antigua')     return new Date(a.fecha_creacion) - new Date(b.fecha_creacion)
      if (filtros.orden === 'limite_asc')  return new Date(a.fecha_limite ?? '9999') - new Date(b.fecha_limite ?? '9999')
      if (filtros.orden === 'limite_desc') return new Date(b.fecha_limite ?? '0000') - new Date(a.fecha_limite ?? '0000')
      return 0
    })

    return result
  }, [actividades, filtros])

  // ── Render — idéntico al original salvo PanelFiltros + filtradas ─────────────
  return (
    <div className="min-h-screen bg-app-bg">
      <Toast mensaje={exito} duracion={2500} onClose={() => setExito(null)} />
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Cabecera — sin cambios */}
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

        {/* Cargando — sin cambios */}
        {cargando ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-[#E1E4E7] shadow-sm">
            <Loader2 className="animate-spin text-brand mb-4" size={40} />
            <p className="text-gray-500 animate-pulse">Cargando tus actividades...</p>
          </div>

        /* Error — sin cambios */
        ) : error ? (
          <ErrorAlert mensaje={error} />

        /* Sin actividades — sin cambios */
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

        /* Lista con filtros — PanelFiltros + filtradas en lugar de actividades */
        ) : (
          <>
            <PanelFiltros actividades={actividades} filtros={filtros} setFiltros={setFiltros} />

            {/* Contador */}
            <p className="text-xs text-gray-400 mb-4 -mt-2 px-1">
              {filtradas.length === actividades.length
                ? `${actividades.length} actividad${actividades.length !== 1 ? 'es' : ''}`
                : `${filtradas.length} de ${actividades.length} actividades`
              }
            </p>

            {/* Sin resultados de filtro */}
            {filtradas.length === 0 ? (
              <div className="bg-white rounded-xl p-16 text-center shadow-sm border border-[#E1E4E7]">
                <div className="bg-app-bg w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="text-gray-300" size={36} />
                </div>
                <h3 className="text-xl font-bold text-[#1A1A1A]">Sin resultados</h3>
                <p className="text-gray-500 mt-2 mb-8 max-w-sm mx-auto">
                  Ninguna actividad coincide con los filtros aplicados.
                </p>
                <button
                  onClick={() => setFiltros({ busqueda: '', tipo: 'all', estado: 'all', materia: 'all', orden: 'reciente' })}
                  className="text-brand font-bold hover:underline transition-colors"
                >
                  Limpiar filtros
                </button>
              </div>
            ) : (
              <div className="grid gap-4">
                {filtradas.map((act) => (
                  <div key={act.id} onClick={() => navigate(`/actividad/${act.id}`)}
                    className="group bg-white p-6 rounded-xl shadow-sm border border-[#E1E4E7] hover:border-brand/40 hover:shadow-md transition-all cursor-pointer flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="bg-app-bg p-4 rounded-xl text-gray-400 group-hover:bg-danger-bg group-hover:text-brand transition-colors">
                        <Calendar size={28} />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-[#1A1A1A] group-hover:text-brand transition-colors">
                          {act.titulo}
                        </h3>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-gray-500">
                          <div className="flex items-center gap-1"><BookOpen size={14} />{act.curso}</div>
                          <span className="bg-card-head text-gray-600 px-2 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider">
                            {act.tipo}
                          </span>
                        </div>
                        {act.fecha_limite && (
                          <div className="flex items-center gap-2 mt-3 text-xs font-bold text-danger-text bg-danger-bg w-fit px-2 py-1 rounded-md">
                            <Clock size={12} />
                            Entrega: {new Date(act.fecha_limite).toLocaleDateString('es-ES', {
                              weekday: 'short', day: 'numeric', month: 'short'
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="hidden sm:block text-right">
                        <p className="text-[10px] uppercase font-black text-gray-300 tracking-widest">Creado</p>
                        <p className="text-xs text-gray-400">{new Date(act.fecha_creacion).toLocaleDateString()}</p>
                      </div>
                      <ChevronRight className="text-gray-300 group-hover:text-brand group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default MisActividades