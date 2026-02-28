import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Save, ArrowLeft, Loader2 } from 'lucide-react'
import Navbar from '../components/Navbar'
import ErrorAlert from '../components/ErrorAlert'
import SubtareaList from '../components/SubtareaList'
import useSubtareas from '../hooks/useSubtareas'

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
const inputCls = 'w-full px-4 py-2.5 border border-[#E1E4E7] rounded-lg text-sm text-[#1A1A1A] focus:ring-2 focus:ring-brand outline-none transition-all'

function CrearActividad() {
  const navigate = useNavigate()
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState(null)
  const { subtareas, agregar, eliminar, toggle } = useSubtareas(null)

  const [formData, setFormData] = useState({
    titulo: '', tipo: 'other', curso: '', descripcion: '',
    fecha_evento: '', fecha_limite: ''
  })

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setCargando(true)
    setError(null)
    try {
      const token = localStorage.getItem('access_token')
      if (!token) throw new Error('No tienes una sesión activa. Inicia sesión.')

      const payload = {
        ...formData,
        fecha_evento: formData.fecha_evento || null,
        fecha_limite: formData.fecha_limite || null
      }

      const response = await fetch(`${API_URL}/api/activities/`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
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
            body: JSON.stringify(sub)
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

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-[#E1E4E7] p-8">
            <h1 className="text-2xl font-bold text-[#1A1A1A] mb-1">Nueva Actividad</h1>
            <p className="text-gray-500 text-sm mb-6">Completa los detalles de tu tarea o examen.</p>
            <ErrorAlert mensaje={error} />

            <div className="space-y-5 mt-4">
              <div>
                <label className="block text-sm font-semibold text-[#1A1A1A] mb-1">Título *</label>
                <input type="text" name="titulo" required value={formData.titulo} onChange={handleChange}
                  placeholder="Ej: Examen Final de Cálculo" className={inputCls} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#1A1A1A] mb-1">Curso / Materia *</label>
                  <input type="text" name="curso" required value={formData.curso} onChange={handleChange}
                    placeholder="Ej: Matemáticas" className={inputCls} />
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
                  placeholder="Detalles adicionales..." className={`${inputCls} resize-none`} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#1A1A1A] mb-1">Fecha y Hora del Evento</label>
                  <input type="datetime-local" name="fecha_evento" value={formData.fecha_evento} onChange={handleChange} className={inputCls} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#1A1A1A] mb-1">Fecha Límite de Entrega</label>
                  <input type="date" name="fecha_limite" value={formData.fecha_limite} onChange={handleChange} className={inputCls} />
                </div>
              </div>
            </div>
          </div>

          <SubtareaList subtareas={subtareas} onAgregar={agregar} onToggle={toggle} onEliminar={eliminar} />

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
