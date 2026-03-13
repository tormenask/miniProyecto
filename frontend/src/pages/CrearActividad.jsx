import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Save, ArrowLeft, Loader2, AlertCircle } from 'lucide-react'
import Navbar from '../components/Navbar'
import Alert from '../components/Alert'
import SubtareaList from '../components/SubtareaList'
import Select from '../components/Select'
import useSubtareas from '../hooks/useSubtareas'
import useActividades from '../hooks/useActividades'
import { CURSOS } from '../utils/cursos'

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

const TIPOS = [
  { value: 'exam', label: 'Examen' },
  { value: 'quiz', label: 'Quiz' },
  { value: 'workshop', label: 'Taller' },
  { value: 'project', label: 'Proyecto' },
  { value: 'other', label: 'Otro' },
]

const baseInput = 'w-full px-4 py-2.5 rounded-lg text-sm text-[#1A1A1A] focus:ring-2 focus:ring-brand outline-none transition-all border'
const inputCls = (err) => `${baseInput} ${err ? 'border-danger-border' : 'border-[#E1E4E7]'}`

function FieldError({ msg }) {
  if (!msg) return null
  return (
    <p className="flex items-center gap-1.5 text-xs text-danger-text mt-1.5 font-medium">
      <AlertCircle size={12} className="shrink-0" /> {msg}
    </p>
  )
}

function CrearActividad() {
  const navigate = useNavigate()
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState(null)
  const [errores, setErrores] = useState({})
  const { subtareas, agregar, eliminar, toggle, editar } = useSubtareas(null)
  const { actividades } = useActividades()

  const [formData, setFormData] = useState({
    titulo: '', tipo: 'other', curso: '', descripcion: '',
    fecha_evento: '', fecha_limite: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errores[name]) setErrores((prev) => ({ ...prev, [name]: null }))
  }

  const validate = () => {
    // Truncar a minutos para que el minuto actual nunca quede "en el pasado"
    // (datetime-local solo tiene precisión de minutos, no segundos)
    const ahora = new Date()
    ahora.setSeconds(0, 0)
    const errs = {}
    if (!formData.titulo.trim()) errs.titulo = 'El título es obligatorio.'
    if (!formData.curso) errs.curso = 'Selecciona un curso.'
    if (!formData.fecha_evento) errs.fecha_evento = 'La fecha de inicio es obligatoria.'
    else if (new Date(formData.fecha_evento) < ahora)
      errs.fecha_evento = 'La fecha de inicio no puede ser en el pasado.'
    if (!formData.fecha_limite) errs.fecha_limite = 'La fecha límite es obligatoria.'
    else if (new Date(formData.fecha_limite) < ahora)
      errs.fecha_limite = 'La fecha límite no puede ser en el pasado.'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrores(errs); return }

    setCargando(true)
    setError(null)
    try {
      const token = localStorage.getItem('access_token')
      if (!token) throw new Error('No tienes una sesión activa. Inicia sesión.')

      const payload = {
        ...formData,
        fecha_evento: formData.fecha_evento ? new Date(formData.fecha_evento).toISOString() : null,
        fecha_limite: formData.fecha_limite ? new Date(formData.fecha_limite).toISOString() : null,
      }

      const response = await fetch(`${API_URL}/api/activities/`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(Object.values(errorData).flat().join(' ') || 'Revisa los datos ingresados.')
      }

      const actividad = await response.json()
      if (subtareas.length > 0) {
        await Promise.all(subtareas.map((sub) =>
          fetch(`${API_URL}/api/activities/${actividad.id}/subtasks/`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify(sub),
          })
        ))
      }
      navigate('/MisActividades', { state: { exito: `¡Actividad "${formData.titulo}" creada con éxito!` } })
    } catch (err) {
      setError(err.message)
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="min-h-screen bg-app-bg">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 py-10">
        <button onClick={() => navigate('/MisActividades')}
          className="flex items-center text-gray-400 hover:text-brand mb-6 transition-colors text-sm">
          <ArrowLeft size={16} className="mr-2" />
          Volver a mis actividades
        </button>

        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-[#E1E4E7] p-8">
            <h1 className="text-2xl font-bold text-[#1A1A1A] mb-1">Nueva Actividad</h1>
            <p className="text-gray-500 text-sm mb-6">Completa los detalles de tu actividad o examen.</p>
            <Alert mensaje={error} />

            <div className="space-y-5 mt-4">
              <div>
                <label className="block text-sm font-semibold text-[#1A1A1A] mb-1">Título *</label>
                <input
                  type="text" name="titulo" value={formData.titulo} onChange={handleChange}
                  placeholder="Ej: Examen Final de Cálculo"
                  className={inputCls(errores.titulo)}
                />
                <FieldError msg={errores.titulo} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#1A1A1A] mb-1">Curso / Materia *</label>
                  <Select
                    name="curso" value={formData.curso} onChange={handleChange}
                    options={CURSOS} placeholder="Selecciona un curso" error={!!errores.curso}
                  />
                  <FieldError msg={errores.curso} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#1A1A1A] mb-1">
                    Tipo <span className="font-normal text-gray-400">(Opcional)</span>
                  </label>
                  <Select name="tipo" value={formData.tipo} onChange={handleChange} options={TIPOS} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1A1A1A] mb-1">
                  Descripción <span className="font-normal text-gray-400">(Opcional)</span>
                </label>
                <textarea
                  name="descripcion" rows="3" value={formData.descripcion} onChange={handleChange}
                  placeholder="Detalles adicionales..."
                  className={`${inputCls(false)} resize-none`}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#1A1A1A] mb-1">Fecha y Hora de Inicio *</label>
                  <input
                    type="datetime-local" name="fecha_evento"
                    value={formData.fecha_evento} onChange={handleChange}
                    className={inputCls(errores.fecha_evento)}
                  />
                  <FieldError msg={errores.fecha_evento} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#1A1A1A] mb-1">Fecha Límite de Entrega *</label>
                  <input
                    type="datetime-local" name="fecha_limite"
                    value={formData.fecha_limite} onChange={handleChange}
                    className={inputCls(errores.fecha_limite)}
                  />
                  <FieldError msg={errores.fecha_limite} />
                </div>
              </div>
            </div>
          </div>

          <SubtareaList
            subtareas={subtareas}
            onAgregar={agregar}
            onToggle={toggle}
            onEliminar={eliminar}
            onEditarSub={editar}
            fechaEvento={formData.fecha_evento}
            fechaLimite={formData.fecha_limite}
            todasActividades={actividades}
            actividadId={null}
          />

          <button type="submit" disabled={cargando}
            className="w-full bg-brand hover:bg-brand-hover text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50 transition-colors">
            {cargando ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            {cargando ? 'Guardando...' : 'Crear Actividad'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default CrearActividad