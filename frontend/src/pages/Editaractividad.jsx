import { useEffect, useState } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { Save, ArrowLeft, Loader2, AlertCircle } from 'lucide-react'
import Navbar from '../components/Navbar'
import ErrorAlert from '../components/ErrorAlert'
import Select from '../components/Select'
import { CURSOS } from '../utils/cursos'

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

// Convierte un ISO UTC ("2026-03-06T15:00:00Z") al formato que acepta
// un <input type="datetime-local"> ("2026-03-06T10:00") en la hora local del navegador.
const toLocalInput = (isoStr) => {
  if (!isoStr) return ''
  const d = new Date(isoStr)
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

const TIPOS = [
  { value: 'exam',     label: 'Examen' },
  { value: 'quiz',     label: 'Quiz' },
  { value: 'workshop', label: 'Taller' },
  { value: 'project',  label: 'Proyecto' },
  { value: 'other',    label: 'Otro' },
]

const baseInput = 'w-full px-4 py-2.5 rounded-lg text-sm text-[#1A1A1A] focus:ring-2 focus:ring-brand outline-none transition-all border'
const inputCls  = (err) => `${baseInput} ${err ? 'border-danger-border' : 'border-[#E1E4E7]'}`

function FieldError({ msg }) {
  if (!msg) return null
  return (
    <p className="flex items-center gap-1.5 text-xs text-danger-text mt-1.5 font-medium">
      <AlertCircle size={12} className="shrink-0" /> {msg}
    </p>
  )
}

function EditarActividad() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/MisActividades'

  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [error, setError]       = useState(null)
  const [errores, setErrores]   = useState({})

  const [formData, setFormData] = useState({
    titulo: '', tipo: 'other', curso: '', descripcion: '',
    fecha_evento: '', fecha_limite: '',
  })

  const token   = localStorage.getItem('access_token')
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }

  useEffect(() => {
    const cargar = async () => {
      try {
        const res = await fetch(`${API_URL}/api/activities/${id}/`, { headers })
        if (res.status === 401) { localStorage.removeItem('access_token'); throw new Error('Sesión expirada. Inicia sesión de nuevo.') }
        if (!res.ok) throw new Error('No se pudo cargar la actividad.')
        const data = await res.json()
        setFormData({
          titulo:       data.titulo       || '',
          tipo:         data.tipo         || 'other',
          curso:        data.curso        || '',
          descripcion:  data.descripcion  || '',
          fecha_evento: toLocalInput(data.fecha_evento),
          fecha_limite: toLocalInput(data.fecha_limite),
        })
      } catch (err) {
        setError(err.message)
      } finally {
        setCargando(false)
      }
    }
    cargar()
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errores[name]) setErrores((prev) => ({ ...prev, [name]: null }))
  }

  const validate = () => {
    // Truncar a minutos para que el minuto actual nunca quede "en el pasado"
    const ahora = new Date()
    ahora.setSeconds(0, 0)
    const errs  = {}
    if (!formData.titulo.trim())    errs.titulo       = 'El título es obligatorio.'
    if (!formData.curso)            errs.curso        = 'Selecciona un curso.'
    if (!formData.fecha_evento)     errs.fecha_evento = 'La fecha de inicio es obligatoria.'
    else if (new Date(formData.fecha_evento) < ahora)
                                    errs.fecha_evento = 'La fecha de inicio no puede ser en el pasado.'
    if (!formData.fecha_limite)     errs.fecha_limite = 'La fecha límite es obligatoria.'
    else if (new Date(formData.fecha_limite) < ahora)
                                    errs.fecha_limite = 'La fecha límite no puede ser en el pasado.'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrores(errs); return }

    setGuardando(true)
    setError(null)
    try {
      const payload = {
        ...formData,
        fecha_evento: formData.fecha_evento ? new Date(formData.fecha_evento).toISOString() : null,
        fecha_limite: formData.fecha_limite ? new Date(formData.fecha_limite).toISOString() : null,
      }
      const res = await fetch(`${API_URL}/api/activities/${id}/`, {
        method: 'PUT', headers, body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const errData = await res.json()
        throw new Error(res.status === 400 ? Object.values(errData).flat().join(' ') : 'Error al guardar. Verifica la conexión.')
      }
      navigate(`/actividad/${id}`, { state: { exito: 'Los cambios fueron guardados con éxito.', from } })
    } catch (err) {
      setError(err.message)
    } finally {
      setGuardando(false)
    }
  }

  if (cargando) {
    return (
      <div className="min-h-screen bg-app-bg">
        <Navbar />
        <div className="max-w-2xl mx-auto px-6 py-10">
          <div className="h-4 bg-gray-200 rounded w-44 mb-6 animate-pulse" />
          <div className="bg-white rounded-xl shadow-sm border border-[#E1E4E7] p-8 animate-pulse space-y-5">
            <div className="space-y-2 mb-6">
              <div className="h-7 bg-gray-200 rounded w-44" />
              <div className="h-3.5 bg-gray-100 rounded w-72" />
            </div>
            <div className="h-10 bg-gray-100 rounded-lg" />
            <div className="grid grid-cols-2 gap-4">
              <div className="h-10 bg-gray-100 rounded-lg" />
              <div className="h-10 bg-gray-100 rounded-lg" />
            </div>
            <div className="h-24 bg-gray-100 rounded-lg" />
            <div className="grid grid-cols-2 gap-4">
              <div className="h-10 bg-gray-100 rounded-lg" />
              <div className="h-10 bg-gray-100 rounded-lg" />
            </div>
            <div className="flex gap-3 pt-2">
              <div className="flex-1 h-12 bg-gray-100 rounded-lg" />
              <div className="flex-1 h-12 bg-gray-200 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-app-bg">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 py-10">
        <button onClick={() => navigate(`/actividad/${id}`, { state: { from } })}
          className="flex items-center text-gray-400 hover:text-brand mb-6 transition-colors text-sm">
          <ArrowLeft size={16} className="mr-2" />
          Volver al detalle
        </button>

        <div className="bg-white rounded-xl shadow-sm border border-[#E1E4E7] p-8">
          <h1 className="text-2xl font-bold text-[#1A1A1A] mb-1">Editar Actividad</h1>
          <p className="text-gray-400 text-sm mb-6">Modifica los campos que necesites y guarda los cambios.</p>

          <ErrorAlert mensaje={error} />

          <form onSubmit={handleSubmit} noValidate className="space-y-5 mt-4">
            {/* Título */}
            <div>
              <label className="block text-sm font-semibold text-[#1A1A1A] mb-1">Título *</label>
              <input
                type="text" name="titulo" value={formData.titulo} onChange={handleChange}
                className={inputCls(errores.titulo)}
              />
              <FieldError msg={errores.titulo} />
            </div>

            {/* Curso + Tipo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#1A1A1A] mb-1">Curso / Materia *</label>
                <Select
                  name="curso"
                  value={formData.curso}
                  onChange={handleChange}
                  options={CURSOS}
                  placeholder="Selecciona un curso"
                  error={!!errores.curso}
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

            {/* Descripción */}
            <div>
              <label className="block text-sm font-semibold text-[#1A1A1A] mb-1">
                Descripción <span className="font-normal text-gray-400">(Opcional)</span>
              </label>
              <textarea
                name="descripcion" rows="3" value={formData.descripcion} onChange={handleChange}
                className={`${inputCls(false)} resize-none`}
              />
            </div>

            {/* Fechas */}
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
                <label className="block text-sm font-semibold text-[#1A1A1A] mb-1">Fecha Límite *</label>
                <input
                  type="datetime-local" name="fecha_limite"
                  value={formData.fecha_limite} onChange={handleChange}
                  className={inputCls(errores.fecha_limite)}
                />
                <FieldError msg={errores.fecha_limite} />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => navigate(`/actividad/${id}`, { state: { from } })}
                className="flex-1 py-3 rounded-lg border border-[#E1E4E7] text-gray-600 font-bold hover:border-gray-400 transition-colors text-sm">
                Cancelar
              </button>
              <button type="submit" disabled={guardando}
                className="flex-1 bg-brand hover:bg-brand-hover text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 disabled:opacity-50 transition-colors text-sm">
                {guardando ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                {guardando ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditarActividad
