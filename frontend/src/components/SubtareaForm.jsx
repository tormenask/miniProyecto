// Formulario para agregar una subtarea.
// Se usa dentro de un Modal (ver SubtareaList).
// Focus ring con color brand. UX #5 validación antes de enviar.
import { useState } from 'react'
import { Plus, Loader2 } from 'lucide-react'
import Alert from './Alert'

function SubtareaForm({ onAgregar, onCancelar, guardando = false }) {
  const [form, setForm] = useState({ nombre: '', fecha_objetivo: '', horas_estimadas: '' })
  const [error, setError] = useState(null)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e?.preventDefault()
    setError(null)

    if (!form.nombre.trim()) { setError('El nombre es obligatorio.'); return }
    if (!form.fecha_objetivo) { setError('La fecha objetivo es obligatoria.'); return }
    if (!form.horas_estimadas || parseFloat(form.horas_estimadas) <= 0) {
      setError('Las horas deben ser mayores a 0.'); return
    }

    onAgregar({ ...form, horas_estimadas: parseFloat(form.horas_estimadas) })
    setForm({ nombre: '', fecha_objetivo: '', horas_estimadas: '' })
  }

  const inputCls = 'w-full px-3 py-2 border border-[#E1E4E7] rounded-lg text-sm focus:ring-2 focus:ring-brand outline-none transition-all'

  return (
    <div className="space-y-3">
      <Alert mensaje={error} type="danger" />

      {/* UX #6 Labels siempre visibles */}
      <div>
        <label className="text-xs text-gray-500 font-semibold block mb-1">Nombre *</label>
        <input
          type="text"
          name="nombre"
          placeholder="Ej: Estudiar capítulo 3"
          value={form.nombre}
          onChange={handleChange}
          className={inputCls}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-gray-500 font-semibold block mb-1">Fecha objetivo *</label>
          <input type="date" name="fecha_objetivo" value={form.fecha_objetivo} onChange={handleChange} className={inputCls} />
        </div>
        <div>
          <label className="text-xs text-gray-500 font-semibold block mb-1">Horas estimadas *</label>
          <input
            type="number" name="horas_estimadas" min="0.5" step="0.5"
            placeholder="Ej: 1.5" value={form.horas_estimadas} onChange={handleChange} className={inputCls}
          />
        </div>
      </div>

      <div className="flex gap-2 justify-end pt-1">
        {onCancelar && (
          <button
            type="button" onClick={onCancelar}
            className="px-4 py-2 text-sm font-semibold text-gray-500 border border-[#E1E4E7] rounded-lg hover:border-gray-400 transition-colors"
          >
            Cancelar
          </button>
        )}
        <button
          type="button" onClick={handleSubmit} disabled={guardando}
          className="flex items-center gap-2 bg-brand hover:bg-brand-hover text-white px-4 py-2 rounded-lg text-sm font-bold disabled:opacity-60 transition-colors"
        >
          {guardando ? <Loader2 className="animate-spin" size={14} /> : <Plus size={14} />}
          Guardar
        </button>
      </div>
    </div>
  )
}

export default SubtareaForm
