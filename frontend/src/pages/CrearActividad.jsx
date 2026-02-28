import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

const TIPOS = [
  { value: 'exam',         label: 'Examen' },
  { value: 'quiz',         label: 'Quiz' },
  { value: 'workshop',     label: 'Taller' },
  { value: 'project',      label: 'Proyecto' },
  { value: 'presentation', label: 'Presentación' },
  { value: 'other',        label: 'Otro' },
]

// ─── Dropdown personalizado ────────────────────────────────────────────────────
function CustomSelect({ options, value, onChange, placeholder, error }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

CustomSelect.propTypes = {
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    label: PropTypes.string,
  })).isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  error: PropTypes.bool,
}

  // Cierra al hacer click fuera
  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selected = options.find(o => o.value === value)

  return (
    <div className="relative" ref={ref}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className={`w-full flex items-center justify-between rounded-xl border px-4 py-3 text-sm bg-gray-50
          focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all text-left
          ${error ? 'border-red-400 bg-red-50' : 'border-gray-200'}
          ${selected ? 'text-gray-800' : 'text-gray-400'}`}
      >
        <span>{selected ? selected.label : placeholder}</span>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Lista desplegable */}
      {open && (
        <div className="absolute z-[9999] mt-1 w-full bg-white rounded-xl border border-gray-200 shadow-lg">
          {options.map((opt, i) => {
            const isSelected = opt.value === value
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => { onChange(opt.value); setOpen(false) }}
                className={`w-full text-left px-4 py-3 text-sm transition-colors
                  ${isSelected
                    ? 'bg-red-50 text-red-600 font-medium'
                    : 'text-gray-700 hover:bg-red-50'}
                  ${i !== 0 ? 'border-t border-gray-100' : ''}
                `}
              >
                {opt.label}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

CustomSelect.propTypes = {
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    label: PropTypes.string,
  })).isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  error: PropTypes.bool,
}

// Sugerencia dinámica: hoy + 3 días
function getSuggestion() {
  const d = new Date()
  d.setDate(d.getDate() + 3)
  return d.toLocaleDateString('es-CO', { day: 'numeric', month: 'long' })
}

function applySuggestion() {
  const d = new Date()
  d.setDate(d.getDate() + 3)
  d.setHours(9, 0, 0, 0)
  // formato yyyy-MM-ddTHH:mm para datetime-local
  return d.toISOString().slice(0, 16)
}

export default function CrearActividad() {
  const navigate = useNavigate()

  const [materias, setMaterias]   = useState([])
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  const [form, setForm] = useState({
    titulo:      '',
    tipo:        '',
    materia:     '',
    fechaEvento: '',
  })

  // Carga materias/cursos desde el API si existe el endpoint,
  // de lo contrario el campo será texto libre como fallback.
  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (!token) { navigate('/login'); return }

    axios.get(`${API_URL}/api/subjects/`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setMaterias(res.data ?? []))
      .catch(() => setMaterias([]))
  }, [navigate])

  function validate() {
    const errs = {}
    if (!form.titulo.trim())  errs.titulo  = 'El nombre de la actividad es obligatorio.'
    if (!form.tipo)           errs.tipo    = 'Selecciona el tipo de evaluación.'
    if (!form.materia.trim()) errs.materia = 'Selecciona o escribe la materia.'
    return errs
  }

  function handleChange(e) {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    if (fieldErrors[name]) setFieldErrors(fe => ({ ...fe, [name]: '' }))
    if (error) setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setFieldErrors(errs); return }

    setLoading(true)
    setError('')
    try {
      const token = localStorage.getItem('access_token')
      const payload = {
        titulo:       form.titulo,
        tipo:         form.tipo,
        curso:        form.materia,
        fecha_evento: form.fechaEvento || null,
        fecha_limite: null,
      }

      const res = await axios.post(`${API_URL}/api/activities/`, payload, {
        headers: {
          Authorization:  `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      // Redirige a la vista de subtareas/detalle con el id creado
      navigate(`/actividad/${res.data.id}`)
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('access_token')
        navigate('/login')
      } else {
        const msg = err.response?.data?.error
          || err.response?.data?.detail
          || 'Error al crear la actividad. Intenta de nuevo.'
        setError(msg)
      }
    } finally {
      setLoading(false)
    }
  }

  const isFechaHint = form.tipo === 'exam' || form.tipo === 'quiz'
  const fechaHint   = isFechaHint
    ? 'Para exámenes o quizzes: cuándo se realiza.'
    : 'Para talleres o proyectos: fecha límite de entrega.'

  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      {/* Barra superior */}
      <header className="bg-white border-b border-gray-200 px-5 py-3 flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
          </svg>
          Volver
        </button>
      </header>

      <main className="max-w-xl mx-auto px-5 py-8">

        {/* Encabezado */}
        <div className="mb-7">
          <h1 className="text-2xl font-bold text-gray-900 leading-tight">
            Nueva actividad evaluativa
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Completa solo la información necesaria para comenzar a planificar
          </p>
        </div>

        {/* Error global */}
        {error && (
          <div role="alert" className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-5 text-sm">
            <span className="shrink-0 mt-0.5">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

          {/* ── Sección 1: Info básica ───────────────────────────── */}
          <div className="bg-white rounded-2xl border border-gray-200">
            <div className="px-5 pt-5 pb-3 border-b border-gray-100">
              <h2 className="font-semibold text-gray-800 text-sm">
                ¿Qué actividad vas a preparar?
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Información básica de tu evaluación
              </p>
            </div>

            <div className="px-5 py-4 flex flex-col gap-4">

              {/* Nombre */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Nombre de la actividad <span className="text-red-500">*</span>
                </label>
                <input
                  name="titulo"
                  type="text"
                  value={form.titulo}
                  onChange={handleChange}
                  placeholder="Ej: Examen parcial"
                  autoFocus
                  className={`w-full rounded-xl border px-4 py-3 text-sm text-gray-800 placeholder-gray-300
                    focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all
                    ${fieldErrors.titulo ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'}`}
                />
                {fieldErrors.titulo && (
                  <p className="text-xs text-red-500 mt-1">{fieldErrors.titulo}</p>
                )}
              </div>

              {/* Tipo */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Tipo <span className="text-red-500">*</span>
                </label>
                <CustomSelect
                  options={TIPOS}
                  value={form.tipo}
                  onChange={val => {
                    setForm(f => ({ ...f, tipo: val }))
                    if (fieldErrors.tipo) setFieldErrors(fe => ({ ...fe, tipo: '' }))
                  }}
                  placeholder="¿Qué tipo de evaluación es?"
                  error={!!fieldErrors.tipo}
                />
                {fieldErrors.tipo && (
                  <p className="text-xs text-red-500 mt-1">{fieldErrors.tipo}</p>
                )}
              </div>

              {/* Materia */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Materia <span className="text-red-500">*</span>
                </label>

                {materias.length > 0 ? (
                  <CustomSelect
                    options={materias.map((m, i) => ({
                      value: m.nombre ?? m.name ?? m.curso ?? String(m),
                      label: m.nombre ?? m.name ?? m.curso ?? String(m),
                    }))}
                    value={form.materia}
                    onChange={val => {
                      setForm(f => ({ ...f, materia: val }))
                      if (fieldErrors.materia) setFieldErrors(fe => ({ ...fe, materia: '' }))
                    }}
                    placeholder="Selecciona una materia"
                    error={!!fieldErrors.materia}
                  />
                ) : (
                  // Fallback texto libre si no hay endpoint de materias
                  <input
                    name="materia"
                    type="text"
                    value={form.materia}
                    onChange={handleChange}
                    placeholder="Ej: Cálculo II"
                    className={`w-full rounded-xl border px-4 py-3 text-sm text-gray-800 placeholder-gray-300
                      focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all
                      ${fieldErrors.materia ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'}`}
                  />
                )}
                {fieldErrors.materia && (
                  <p className="text-xs text-red-500 mt-1">{fieldErrors.materia}</p>
                )}
              </div>

            </div>
          </div>

          {/* ── Sección 2: Fecha ─────────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-gray-200">
            <div className="px-5 pt-5 pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="text-red-500 text-lg">📅</span>
                <div>
                  <h2 className="font-semibold text-gray-800 text-sm">
                    ¿Cuándo es la fecha límite?
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Esta fecha te ayudará a priorizar y organizar tu tiempo
                  </p>
                </div>
              </div>
            </div>

            <div className="px-5 py-4 flex flex-col gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Fecha y hora de la evaluación
                </label>
                <input
                  name="fechaEvento"
                  type="datetime-local"
                  value={form.fechaEvento}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700
                    focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all"
                />
              </div>

              {/* Hint contextual */}
              <div className="flex items-start gap-2 text-xs text-gray-400">
                <span className="shrink-0 mt-0.5">ℹ️</span>
                <span>{fechaHint}</span>
              </div>

              {/* Sugerencia accionable */}
              <button
                type="button"
                onClick={() => {
                  setForm(f => ({ ...f, fechaEvento: applySuggestion() }))
                  setFieldErrors(fe => ({ ...fe, fechaEvento: '' }))
                }}
                className="text-xs text-red-500 font-medium text-left hover:underline transition-all"
              >
                Sugerencia: establecer para dentro de 3 días ({getSuggestion()})
              </button>
            </div>
          </div>

          {/* ── Consejo ──────────────────────────────────────────── */}
          <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-2xl px-4 py-4">
            <span className="text-blue-400 text-base shrink-0 mt-0.5">ℹ️</span>
            <div className="text-sm text-blue-700">
              <span className="font-semibold">Consejo:</span>{' '}
              Después de crear la actividad, podrás dividirla en subtareas pequeñas para distribuir mejor tu tiempo de estudio.
            </div>
          </div>

          {/* ── Botones ──────────────────────────────────────────── */}
          <div className="flex items-center gap-3 pt-1">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-red-300 disabled:cursor-not-allowed
                text-white font-semibold rounded-xl py-3.5 text-sm transition-colors
                flex items-center justify-center gap-2 shadow-md shadow-red-100"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creando…
                </>
              ) : 'Crear y continuar'}
            </button>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-5 py-3.5 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors rounded-xl hover:bg-gray-100"
            >
              Cancelar
            </button>
          </div>

        </form>
      </main>
    </div>
  )
}