// Actividad.jsx
// Vista de detalle de una actividad: info, progreso y gestión de subtareas.
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import axios from 'axios'
import Modal, { useModal } from '../components/Modal'

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

const TIPO_CONFIG = {
  exam: { label: 'Examen', color: 'bg-red-500 text-white' },
  quiz: { label: 'Quiz', color: 'bg-violet-500 text-white' },
  workshop: { label: 'Taller', color: 'bg-amber-500 text-white' },
  project: { label: 'Proyecto', color: 'bg-blue-500 text-white' },
  presentation: { label: 'Presentación', color: 'bg-pink-500 text-white' },
  other: { label: 'Otro', color: 'bg-gray-400 text-white' },
}

const ESTADO_CONFIG = {
  done: { label: 'Hecho', color: 'bg-green-100 text-green-700 border-green-200', dot: 'bg-green-500' },
  pending: { label: 'Pendiente', color: 'bg-gray-100 text-gray-600 border-gray-200', dot: 'bg-gray-400' },
  postponed: { label: 'Pospuesto', color: 'bg-amber-100 text-amber-700 border-amber-200', dot: 'bg-amber-400' },
}

function normalizeActivity(a) {
  return {
    id: a.id,
    titulo: a.titulo ?? a.title ?? '',
    tipo: a.tipo ?? a.type ?? 'other',
    curso: a.curso ?? a.course ?? '',
    fechaEvento: a.fecha_evento ?? a.fechaEvento ?? null,
    fechaLimite: a.fecha_limite ?? a.fechaLimite ?? null,
    subtareas: (a.subtareas ?? a.subtasks ?? a.subactivities ?? []).map(s => ({
      id: s.id,
      nombre: s.nombre ?? s.name ?? '',
      estado: s.estado ?? s.status ?? 'pending',
      completada: (s.estado ?? s.status ?? 'pending') === 'done',
      fechaObjetivo: s.fecha_objetivo ?? s.targetDate ?? s.target_date ?? '',
      horasEstimadas: s.horas_estimadas ?? s.estimatedHours ?? s.hours ?? '',
    })),
  }
}



// ─── Badge de estado ──────────────────────────────────────────────────────────
function EstadoBadge({ estado }) {
  const cfg = ESTADO_CONFIG[estado] ?? ESTADO_CONFIG.pending
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1
      rounded-full border ${cfg.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  )
}

EstadoBadge.propTypes = {
  estado: PropTypes.string.isRequired,
}

EstadoDropdown.propTypes = {
  current: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
}
// ─── Modal para cambiar estado ────────────────────────────────────────────────
function EstadoDropdown({ current, onChange }) {
  const [open, setOpen] = useState(false)
  const estados = Object.entries(ESTADO_CONFIG)

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="text-xs font-medium px-3 py-1.5 rounded-lg border border-gray-200
          bg-white hover:bg-gray-50 text-gray-600 transition-colors"
      >
        Estado
      </button>
      {open && (
        <div className="absolute right-0 mt-1 w-36 bg-white rounded-xl border border-gray-200
          shadow-lg z-20 overflow-hidden">
          {estados.map(([val, cfg]) => (
            <button
              key={val}
              type="button"
              onClick={() => { onChange(val); setOpen(false) }}
              className={`w-full text-left px-3 py-2.5 text-xs font-medium flex items-center gap-2
                transition-colors hover:bg-gray-50
                ${current === val ? 'bg-gray-50' : ''}`}
            >
              <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
              {cfg.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Tarjeta de subtarea ──────────────────────────────────────────────────────
function SubtareaCard({ subtarea, onEstadoChange, onDelete }) {
  const isDone = subtarea.estado === 'done'

  return (
    <div className="bg-white rounded-xl border border-gray-200 px-4 py-3.5
      hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="mb-1.5">
            <EstadoBadge estado={subtarea.estado} />
          </div>
          <p className={`text-sm font-medium text-gray-800 leading-snug
            ${isDone ? 'line-through text-gray-400' : ''}`}>
            {subtarea.nombre}
          </p>
          <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
            {subtarea.fechaObjetivo && (
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="3" y="4" width="18" height="18" rx="2" strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M16 2v4M8 2v4M3 10h18" strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {subtarea.fechaObjetivo}
              </span>
            )}
            {subtarea.horasEstimadas && (
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" strokeWidth="2" />
                  <path d="M12 6v6l4 2" strokeWidth="2" strokeLinecap="round" />
                </svg>
                {subtarea.horasEstimadas}h estimadas
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <EstadoDropdown current={subtarea.estado} onChange={val => onEstadoChange(subtarea.id, val)} />
          <button
            type="button"
            onClick={() => onDelete(subtarea.id)}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-red-100
              text-red-400 hover:bg-red-50 hover:text-red-500 transition-colors"
            aria-label="Eliminar subtarea"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

SubtareaCard.propTypes = {
  subtarea: PropTypes.shape({
    id: PropTypes.number.isRequired,
    nombre: PropTypes.string.isRequired,
    estado: PropTypes.string.isRequired,
    fechaObjetivo: PropTypes.string,
    horasEstimadas: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }).isRequired,
  onEstadoChange: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
}

AgregarSubtareaModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
}
// ─── Modal agregar subtarea ───────────────────────────────────────────────────
function AgregarSubtareaModal({ isOpen, onClose, onSave }) {
  const [form, setForm] = useState({ nombre: '', fechaObjetivo: '', horasEstimadas: '' })
  const [err, setErr] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.nombre.trim()) { setErr('El nombre es obligatorio.'); return }
    onSave({ ...form, estado: 'pending' })
    setForm({ nombre: '', fechaObjetivo: '', horasEstimadas: '' })
    setErr('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(2px)' }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl border border-gray-200 shadow-xl w-full max-w-sm p-6"
        style={{ animation: 'modalIn 0.18s cubic-bezier(.4,0,.2,1) both' }}
        onClick={e => e.stopPropagation()}
      >
        <style>{`
          @keyframes modalIn {
            from { opacity:0; transform:scale(.95) translateY(8px); }
            to   { opacity:1; transform:scale(1)   translateY(0);   }
          }
        `}</style>

        <h3 className="text-base font-bold text-gray-800 mb-4">Nueva subtarea</h3>

        {err && (
          <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-3">{err}</p>
        )}

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Nombre <span className="text-red-500">*</span>
            </label>
            <input
              autoFocus
              type="text"
              value={form.nombre}
              onChange={e => { setForm(f => ({ ...f, nombre: e.target.value })); setErr('') }}
              placeholder="ej. Estudiar capítulo 3"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm
                focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Fecha objetivo</label>
              <input
                type="date"
                value={form.fechaObjetivo}
                onChange={e => setForm(f => ({ ...f, fechaObjetivo: e.target.value }))}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm
                  focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Horas estimadas</label>
              <input
                type="number"
                min="0.5"
                step="0.5"
                value={form.horasEstimadas}
                onChange={e => setForm(f => ({ ...f, horasEstimadas: e.target.value }))}
                placeholder="ej. 2.5"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm
                  focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold text-sm
                rounded-xl py-2.5 transition-colors"
            >
              Agregar
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-100
                rounded-xl transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Página principal ─────────────────────────────────────────────────────────
export default function Actividad() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [actividad, setActividad] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [showAgregar, setShowAgregar] = useState(false)

  const { modal, closeModal, showError, showConfirm } = useModal()

  const token = () => localStorage.getItem('access_token')

  // ── Carga inicial ───────────────────────────────────────────────────────────
  useEffect(() => {
    const t = token()
    if (!t) { navigate('/login'); return }

    axios.get(`${API_URL}/api/activities/${id}/`, {
      headers: { Authorization: `Bearer ${t}` }
    })
      .then(res => {
        console.log('Actividad cargada:', res.data.subactivities)
        setActividad(normalizeActivity(res.data))
      })
      .catch(err => {
        if (err.response?.status === 401) { localStorage.removeItem('access_token'); navigate('/login') }
        else showError('No se pudo cargar', 'Error al obtener la actividad del servidor.')
      })
      .finally(() => setCargando(false))
  }, [id, navigate, showError])

  // ── Cambiar estado de subtarea ──────────────────────────────────────────────
  async function handleEstadoChange(subtareaId, nuevoEstado) {
    try {
      await axios.patch(
        `${API_URL}/api/activities/${id}/subtasks/${subtareaId}/`,
        { estado: nuevoEstado },
        { headers: { Authorization: `Bearer ${token()}` } }
      )
      setActividad(a => ({
        ...a,
        subtareas: a.subtareas.map(s =>
          s.id === subtareaId ? { ...s, estado: nuevoEstado } : s
        ),
      }))
    } catch {
      showError('Error', 'No se pudo actualizar el estado de la subtarea.')
    }
  }

  // ── Eliminar subtarea ───────────────────────────────────────────────────────
  function handleDeleteSubtarea(subtareaId) {
    showConfirm(
      '¿Eliminar subtarea?',
      'Esta acción no se puede deshacer.',
      async () => {
        try {
          await axios.delete(
            `${API_URL}/api/activities/${id}/subtasks/${subtareaId}/`,
            { headers: { Authorization: `Bearer ${token()}` } }
          )
          setActividad(a => ({
            ...a,
            subtareas: a.subtareas.filter(s => s.id !== subtareaId),
          }))
        } catch {
          showError('Error', 'No se pudo eliminar la subtarea.')
        }
      },
      { confirm: 'Sí, eliminar', cancel: 'Cancelar' }
    )
  }

  // ── Agregar subtarea ────────────────────────────────────────────────────────
  async function handleAgregarSubtarea(nueva) {
    try {
      const res = await axios.post(
        `${API_URL}/api/activities/${id}/subtasks/`,
        {
          nombre: nueva.nombre,
          fecha_objetivo: nueva.fechaObjetivo || null,
          horas_estimadas: nueva.horasEstimadas || null,
          estado: 'pending',
        },
        { headers: { Authorization: `Bearer ${token()}`, 'Content-Type': 'application/json' } }
      )
      const nueva_normalizada = {
        id: res.data.id,
        nombre: res.data.nombre ?? nueva.nombre,
        estado: res.data.estado ?? 'pending',
        fechaObjetivo: res.data.fecha_objetivo ?? nueva.fechaObjetivo,
        horasEstimadas: res.data.horas_estimadas ?? nueva.horasEstimadas,
      }
      setActividad(a => ({ ...a, subtareas: [...a.subtareas, nueva_normalizada] }))
    } catch {
      showError('Error', 'No se pudo agregar la subtarea.')
    }
  }

  // ── Métricas de progreso ────────────────────────────────────────────────────
  const totalSubtareas = actividad?.subtareas.length ?? 0
  const completadas = actividad?.subtareas.filter(s => s.estado === 'done').length ?? 0
  const progreso = totalSubtareas ? Math.round((completadas / totalSubtareas) * 100) : 0
  const tipoConfig = TIPO_CONFIG[actividad?.tipo] ?? TIPO_CONFIG.other

  // ── Render ──────────────────────────────────────────────────────────────────
  if (cargando) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen bg-gray-50">
        <span className="w-8 h-8 border-4 border-red-200 border-t-red-500 rounded-full animate-spin" />
      </div>
    )
  }

  if (!actividad) return null

  return (
    <div className="min-h-screen bg-gray-50 pb-12">

      {/* Breadcrumb */}
      <div className="px-6 pt-5 pb-2">
        <button
          type="button"
          onClick={() => navigate('/hoy')}
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver a Hoy
        </button>
      </div>

      <div className="max-w-2xl mx-auto px-5 flex flex-col gap-4">

        {/* ── Card: Info de la actividad ─────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-200 px-5 py-5">
          <div className="flex items-start justify-between gap-3 mb-3">
            {/* Badges */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${tipoConfig.color}`}>
                {tipoConfig.label}
              </span>
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 border border-gray-200">
                {actividad.curso}
              </span>
            </div>

            {/* Botón editar */}
            <button
              type="button"
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800
                border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors shrink-0"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Editar
            </button>
          </div>

          <h1 className="text-xl font-bold text-gray-900 leading-tight mb-2">
            {actividad.titulo}
          </h1>

          {actividad.fechaEvento && (
            <p className="text-xs text-gray-400 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="3" y="4" width="18" height="18" rx="2" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round" />
                <path d="M16 2v4M8 2v4M3 10h18" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Fecha del evento: {actividad.fechaEvento}
            </p>
          )}
        </div>

        {/* ── Card: Progreso ─────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-200 px-5 py-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Progreso de la actividad</h2>

          <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
            <span>{completadas} de {totalSubtareas} subtareas completadas</span>
            <span className="font-semibold text-gray-700">{progreso}%</span>
          </div>

          <div className="h-3 bg-gray-100 rounded-full">
            <div
              className="h-full bg-red-500 rounded-full transition-all duration-500"
              style={{ width: `${progreso}%` }}
            />
          </div>
        </div>

        {/* ── Card: Subtareas ────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-200">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-700">Subtareas del plan</h2>
            <button
              type="button"
              onClick={() => setShowAgregar(true)}
              className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white
                text-xs font-semibold px-3 py-2 rounded-xl transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 5v14M5 12h14" />
              </svg>
              Agregar subtarea
            </button>
          </div>

          {actividad.subtareas.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <svg className="w-10 h-10 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-sm font-medium text-gray-500">Sin subtareas aún</p>
              <p className="text-xs mt-0.5">Agrega subtareas para organizar tu estudio</p>
            </div>
          ) : (
            <div className="flex flex-col gap-px bg-gray-100">
              {actividad.subtareas.map(st =>(
                <div key={st.id} className="bg-gray-50 px-4 py-1">
                  <SubtareaCard
                    subtarea={st}
                    onEstadoChange={handleEstadoChange}
                    onDelete={handleDeleteSubtarea}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Modales */}
      <AgregarSubtareaModal
        isOpen={showAgregar}
        onClose={() => setShowAgregar(false)}
        onSave={handleAgregarSubtarea}
      />
      <Modal {...modal} onClose={closeModal} />
    </div>
  )
}