import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Save, ArrowLeft, Loader2 } from 'lucide-react'
import Navbar from '../components/Navbar'
import ErrorAlert from '../components/ErrorAlert'
import Alert from '../components/Alert'

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
const inputCls = 'w-full px-4 py-2.5 border border-[#E1E4E7] rounded-lg text-sm text-[#1A1A1A] focus:ring-2 focus:ring-brand outline-none transition-all'

function EditarActividad() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState(null)
  const [exito, setExito] = useState(null)

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
          fecha_evento: data.fecha_evento ? data.fecha_evento.slice(0, 16) : '',
          fecha_limite: data.fecha_limite || '',
        })
      } catch (err) {
        setError(err.message)
      } finally {
        setCargando(false)
      }
    }
    cargar()
  }, [id])

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setGuardando(true)
    setError(null)
    try {
      const payload = {
        ...formData,
        fecha_evento: formData.fecha_evento || null,
        fecha_limite: formData.fecha_limite || null,
      }
      const res = await fetch(`${API_URL}/api/activities/${id}/`, {
        method: 'PUT', headers, body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const errData = await res.json()
        throw new Error(res.status === 400 ? Object.values(errData).flat().join(' ') : 'Error al guardar. Verifica la conexión.')
      }
      window.scrollTo({ top: 0, behavior: 'smooth' })
      setExito('Los cambios fueron guardados con éxito. Volviendo al detalle...')
      setTimeout(() => navigate(`/actividad/${id}`), 2500)
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
        <div className="flex flex-col items-center justify-center py-32">
          <Loader2 className="animate-spin text-brand mb-4" size={40} />
          <p className="text-gray-400 animate-pulse">Cargando datos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-app-bg">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 py-10">
        <button onClick={() => navigate(`/actividad/${id}`)}
          className="flex items-center text-gray-400 hover:text-brand mb-6 transition-colors text-sm">
          <ArrowLeft size={16} className="mr-2" />
          Volver al detalle
        </button>

        <Alert type="success" mensaje={exito} />

        <div className="bg-white rounded-xl shadow-sm border border-[#E1E4E7] p-8">
          <h1 className="text-2xl font-bold text-[#1A1A1A] mb-1">Editar Actividad</h1>
          <p className="text-gray-400 text-sm mb-6">Modifica los campos que necesites y guarda los cambios.</p>

          <ErrorAlert mensaje={error} />

          <form onSubmit={handleSubmit} className="space-y-5 mt-4">
            <div>
              <label className="block text-sm font-semibold text-[#1A1A1A] mb-1">Título *</label>
              <input type="text" name="titulo" required value={formData.titulo} onChange={handleChange} className={inputCls} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#1A1A1A] mb-1">Curso / Materia *</label>
                <input type="text" name="curso" required value={formData.curso} onChange={handleChange} className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#1A1A1A] mb-1">Tipo</label>
                <select name="tipo" value={formData.tipo} onChange={handleChange} className={`${inputCls} bg-white`}>
                  <option value="exam">Examen</option>
                  <option value="quiz">Quiz</option>
                  <option value="workshop">Taller</option>
                  <option value="project">Proyecto</option>
                  <option value="other">Otro</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1A1A1A] mb-1">
                Descripción <span className="font-normal text-gray-400">(Opcional)</span>
              </label>
              <textarea name="descripcion" rows="3" value={formData.descripcion} onChange={handleChange}
                className={`${inputCls} resize-none`} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#1A1A1A] mb-1">Fecha y Hora del Evento</label>
                <input type="datetime-local" name="fecha_evento" value={formData.fecha_evento} onChange={handleChange} className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#1A1A1A] mb-1">Fecha Límite</label>
                <input type="date" name="fecha_limite" value={formData.fecha_limite} onChange={handleChange} className={inputCls} />
              </div>
            </div>

            {/* Botones: secundario con borde #E1E4E7, primario brand */}
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => navigate(`/actividad/${id}`)}
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
