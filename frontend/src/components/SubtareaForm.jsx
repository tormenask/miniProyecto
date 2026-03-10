import { useState, useRef } from 'react'
import { Plus, Loader2 } from 'lucide-react'
import Alert from './Alert'

function SubtareaForm({ onAgregar, onCancelar, guardando = false, fechaEvento, fechaLimite }) {
  const [form, setForm] = useState({ nombre: '', fecha_objetivo: '', horas_estimadas: '' })
  const [error, setError] = useState(null)

  const nombreRef = useRef(null)
  const fechaRef = useRef(null)
  const horasRef = useRef(null)

  const soloFecha = (str) => {
    if (!str) return null
    const fecha = new Date(str)
    const year = fecha.getFullYear()
    const month = String(fecha.getMonth() + 1).padStart(2, '0')
    const day = String(fecha.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const fechaMinStr = soloFecha(fechaEvento)
  const fechaMaxStr = soloFecha(fechaLimite)
  const fechaMinDisplay = fechaEvento
    ? new Date(fechaEvento).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
    : null
  const fechaMaxDisplay = fechaLimite
    ? new Date(fechaLimite).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
    : null

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))

    if (name === 'fecha_objetivo') {
      if (fechaMinStr && value < fechaMinStr)
        setError(`La fecha no puede ser anterior al ${fechaMinDisplay}.`)
      else if (fechaMaxStr && value > fechaMaxStr)
        setError(`La fecha no puede ser posterior al ${fechaMaxDisplay}.`)
      else
        setError(null)
    }
  }

  const handleSubmit = (e) => {
    e?.preventDefault()
    setError(null)

    if (!form.nombre.trim()) {
      setError('El nombre es obligatorio.')
      nombreRef.current?.focus()
      return
    }
    if (!form.fecha_objetivo) {
      setError('La fecha objetivo es obligatoria.')
      fechaRef.current?.focus()
      return
    }
    if (!form.horas_estimadas || parseFloat(form.horas_estimadas) <= 0) {
      setError('Las horas deben ser mayores a 0.')
      horasRef.current?.focus()
      return
    }
    if (fechaMinStr && form.fecha_objetivo < fechaMinStr) {
      setError(`La fecha objetivo no puede ser anterior al ${fechaMinDisplay}.`)
      fechaRef.current?.focus()
      return
    }
    if (fechaMaxStr && form.fecha_objetivo > fechaMaxStr) {
      setError(`La fecha objetivo no puede ser posterior al ${fechaMaxDisplay}.`)
      fechaRef.current?.focus()
      return
    }

    onAgregar({ ...form, horas_estimadas: parseFloat(form.horas_estimadas) })
    setForm({ nombre: '', fecha_objetivo: '', horas_estimadas: '' })
  }

  const inputCls = 'w-full px-3 py-2 border border-[#E1E4E7] rounded-lg text-sm focus:ring-2 focus:ring-brand outline-none transition-all'

  return (
    <div className="space-y-3">
      <Alert mensaje={error} type="danger" />

      <div>
        <label className="text-xs text-gray-500 font-semibold block mb-1">Nombre *</label>
        <input
          ref={nombreRef} type="text" name="nombre"
          placeholder="Ej: Estudiar capítulo 3"
          value={form.nombre} onChange={handleChange} className={inputCls}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-gray-500 font-semibold block mb-1">Fecha objetivo *</label>
          <input
            ref={fechaRef} type="date" name="fecha_objetivo"
            value={form.fecha_objetivo} onChange={handleChange}
            min={fechaMinStr ?? undefined}
            max={fechaMaxStr ?? undefined}
            className={inputCls}
          />
          {(fechaMinDisplay || fechaMaxDisplay) && (
            <p className="text-[10px] text-gray-400 mt-1">
              Entre {fechaMinDisplay || '—'} y {fechaMaxDisplay || '—'}
            </p>
          )}
        </div>
        <div>
          <label className="text-xs text-gray-500 font-semibold block mb-1">Horas estimadas *</label>
          <input
            ref={horasRef} type="number" name="horas_estimadas"
            min="0.5" step="0.5" placeholder="Ej: 1.5"
            value={form.horas_estimadas} onChange={handleChange} className={inputCls}
          />
        </div>
      </div>

      <div className="flex gap-2 justify-end pt-1">
        {onCancelar && (
          <button type="button" onClick={onCancelar}
            className="px-4 py-2 text-sm font-semibold text-gray-500 border border-[#E1E4E7] rounded-lg hover:border-gray-400 transition-colors">
            Cancelar
          </button>
        )}
        <button type="button" onClick={handleSubmit} disabled={guardando}
          className="flex items-center gap-2 bg-brand hover:bg-brand-hover text-white px-4 py-2 rounded-lg text-sm font-bold disabled:opacity-60 transition-colors">
          {guardando ? <Loader2 className="animate-spin" size={14} /> : <Plus size={14} />}
          Guardar
        </button>
      </div>
    </div>
  )
}

export default SubtareaForm