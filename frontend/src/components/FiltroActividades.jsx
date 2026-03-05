// FiltroActividades.jsx
// Panel de filtros unificado: diseño tipo card del mockup + chips de tipo y búsqueda.
// Props:
//   actividades   – array completo sin filtrar (para derivar opciones de materia)
//   onChange      – fn(filtroActivo) llamada cada vez que cambia algún filtro
//   className     – clases extra opcionales

import { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { Search, X, Filter } from 'lucide-react'

const TIPOS = [
    { value: 'all', label: 'Todos los tipos' },
    { value: 'exam', label: 'Examen' },
    { value: 'quiz', label: 'Quiz' },
    { value: 'workshop', label: 'Taller' },
    { value: 'project', label: 'Proyecto' },
    { value: 'presentation', label: 'Presentación' },
    { value: 'other', label: 'Otro' },
]

const ESTADOS = [
    { value: 'all', label: 'Todos los estados' },
    { value: 'pending', label: 'Pendiente' },
    { value: 'done', label: 'Hecho' },
    { value: 'postponed', label: 'Pospuesto' },
]

const ORDEN = [
    { value: 'reciente', label: 'Más recientes' },
    { value: 'antigua', label: 'Más antiguas' },
    { value: 'limite_asc', label: 'Fecha límite ↑' },
    { value: 'limite_desc', label: 'Fecha límite ↓' },
]

// ─── Dropdown personalizado (igual al de CrearActividad) ──────────────────────
function CustomDropdown({ options, value, onChange, minWidth = 'min-w-[180px]' }) {
    const [open, setOpen] = useState(false)
    const ref = useRef(null)

    CustomDropdown.propTypes = {
        options: PropTypes.arrayOf(PropTypes.shape({
            value: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
        })).isRequired,
        value: PropTypes.string.isRequired,
        onChange: PropTypes.func.isRequired,
        minWidth: PropTypes.string,
    }

    useEffect(() => {
        function onClick(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
        document.addEventListener('mousedown', onClick)
        return () => document.removeEventListener('mousedown', onClick)
    }, [])

    const selected = options.find(o => o.value === value) ?? options[0]

    return (
        <div className={`relative ${minWidth}`} ref={ref}>
            <button
                type="button"
                onClick={() => setOpen(o => !o)}
                className="w-full flex items-center justify-between gap-3 rounded-xl border border-gray-200
          bg-white px-3.5 py-2.5 text-sm text-gray-700 hover:border-gray-300 transition-colors"
            >
                <span className={value === 'all' ? 'text-gray-400' : 'text-gray-800 font-medium'}>
                    {selected.label}
                </span>
                <svg
                    className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {open && (
                <div className="absolute left-0 top-full mt-1 w-full bg-white rounded-xl border border-gray-200
          shadow-lg z-30 overflow-hidden">
                    {options.map((opt, i) => {
                        const isSelected = opt.value === value
                        return (
                            <button
                                key={opt.value}
                                type="button"
                                onClick={() => { onChange(opt.value); setOpen(false) }}
                                className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors
                  ${i !== 0 ? 'border-t border-gray-100' : ''}
                  ${isSelected ? 'text-red-600 font-medium bg-red-50' : 'text-gray-700 hover:bg-gray-50'}`}
                            >
                                <span>{opt.label}</span>
                                {isSelected && (
                                    <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

FiltroActividades.propTypes = {
    actividades: PropTypes.array,
    onChange: PropTypes.func,
    className: PropTypes.string,
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function FiltroActividades({ actividades = [], onChange, className = '' }) {
    const [busqueda, setBusqueda] = useState('')
    const [tipo, setTipo] = useState('all')
    const [estado, setEstado] = useState('all')
    const [materia, setMateria] = useState('all')
    const [orden, setOrden] = useState('reciente')

    // Deriva lista única de materias desde las actividades
    const materias = [
        { value: 'all', label: 'Todas las materias' },
        ...[...new Set(actividades.map(a => a.curso ?? a.course ?? '').filter(Boolean))]
            .sort()
            .map(m => ({ value: m, label: m })),
    ]

    // Notifica al padre cada vez que cambia cualquier filtro
    useEffect(() => {
        onChange?.({ busqueda, tipo, estado, materia, orden })
    }, [busqueda, tipo, estado, materia, orden, onChange])

    const hayFiltros = busqueda || tipo !== 'all' || estado !== 'all' || materia !== 'all' || orden !== 'reciente'

    function limpiar() {
        setBusqueda(''); setTipo('all'); setEstado('all'); setMateria('all'); setOrden('reciente')
    }

    return (
        <div className={`bg-white rounded-2xl border border-gray-200 overflow-hidden ${className}`}>

            {/* ── Encabezado de la card ─────────────────────────────────────── */}
            <div className="px-5 pt-4 pb-3 border-b border-gray-100">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-red-400" />
                        <span className="text-sm font-semibold text-gray-700">Filtrar tareas</span>
                    </div>
                    {hayFiltros && (
                        <button
                            type="button"
                            onClick={limpiar}
                            className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors"
                        >
                            <X className="w-3 h-3" />
                            Limpiar
                        </button>
                    )}
                </div>
                <p className="text-xs text-gray-400 mt-0.5">Enfócate en lo que necesitas ver ahora</p>
            </div>

            <div className="px-5 py-4 flex flex-col gap-3">

                {/* ── Buscador ─────────────────────────────────────────────────── */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
                    <input
                        type="text"
                        value={busqueda}
                        onChange={e => setBusqueda(e.target.value)}
                        placeholder="Buscar por título o materia…"
                        className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-gray-200 bg-gray-50
              text-sm text-gray-700 placeholder-gray-300
              focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all"
                    />
                    {busqueda && (
                        <button
                            type="button"
                            onClick={() => setBusqueda('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>

                {/* ── Dropdowns: materia + estado ───────────────────────────────── */}
                <div className="flex gap-3 flex-wrap">
                    <CustomDropdown
                        options={materias}
                        value={materia}
                        onChange={setMateria}
                        minWidth="min-w-0 flex-1"
                    />
                    <CustomDropdown
                        options={ESTADOS}
                        value={estado}
                        onChange={setEstado}
                        minWidth="min-w-0 flex-1"
                    />
                </div>

                {/* ── Chips de tipo ─────────────────────────────────────────────── */}
                <div className="flex items-center gap-1.5 flex-wrap">
                    {TIPOS.map(t => (
                        <button
                            key={t.value}
                            type="button"
                            onClick={() => setTipo(t.value)}
                            className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors
                ${tipo === t.value
                                    ? 'bg-red-500 text-white border-red-500'
                                    : 'bg-white text-gray-500 border-gray-200 hover:border-red-300 hover:text-red-500'
                                }`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                {/* ── Ordenar ───────────────────────────────────────────────────── */}
                <div className="flex items-center gap-2 pt-0.5 border-t border-gray-100">
                    <span className="text-xs text-gray-400 shrink-0">Ordenar por</span>
                    <div className="flex gap-1.5 flex-wrap">
                        {ORDEN.map(o => (
                            <button
                                key={o.value}
                                type="button"
                                onClick={() => setOrden(o.value)}
                                className={`text-xs px-2.5 py-1 rounded-lg border transition-colors
                  ${orden === o.value
                                        ? 'bg-gray-800 text-white border-gray-800'
                                        : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400 hover:text-gray-700'
                                    }`}
                            >
                                {o.label}
                            </button>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    )
}