import { useState } from "react"
import { Plus, Loader2, AlertCircle } from "lucide-react"

function SubtareaForm({ onAgregar, onCancelar, guardando = false }) {
    const [form, setForm] = useState({ nombre: "", fecha_objetivo: "", horas_estimadas: "" })
    const [error, setError] = useState(null)

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

    const handleSubmit = (e) => {
        e?.preventDefault()
        setError(null)

        if (!form.nombre.trim()) { setError("El nombre es obligatorio."); return }
        if (!form.fecha_objetivo) { setError("La fecha objetivo es obligatoria."); return }
        if (!form.horas_estimadas || parseFloat(form.horas_estimadas) <= 0) {
            setError("Las horas deben ser mayores a 0."); return
        }

        onAgregar({ ...form, horas_estimadas: parseFloat(form.horas_estimadas) })
        setForm({ nombre: "", fecha_objetivo: "", horas_estimadas: "" })
    }

    return (
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 space-y-3">
            <p className="text-sm font-bold text-gray-700">Nueva subtarea</p>

            {error && (
                <div className="flex items-center gap-2 text-red-600 text-xs bg-red-50 px-3 py-2 rounded-lg">
                    <AlertCircle size={14} /> {error}
                </div>
            )}

            <input
                type="text"
                name="nombre"
                placeholder="Nombre de la subtarea *"
                value={form.nombre}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-black outline-none"
            />

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="text-xs text-gray-500 font-semibold block mb-1">Fecha objetivo *</label>
                    <input
                        type="date"
                        name="fecha_objetivo"
                        value={form.fecha_objetivo}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-black outline-none"
                    />
                </div>
                <div>
                    <label className="text-xs text-gray-500 font-semibold block mb-1">Horas estimadas *</label>
                    <input
                        type="number"
                        name="horas_estimadas"
                        min="0.5"
                        step="0.5"
                        placeholder="Ej: 1.5"
                        value={form.horas_estimadas}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-black outline-none"
                    />
                </div>
            </div>

            <div className="flex gap-2 justify-end">
                {onCancelar && (
                    <button type="button" onClick={onCancelar} className="px-4 py-2 text-sm font-semibold text-gray-500 hover:text-black">
                        Cancelar
                    </button>
                )}
                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={guardando}
                    className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-800 disabled:opacity-60 transition-colors"
                >
                    {guardando ? <Loader2 className="animate-spin" size={14} /> : <Plus size={14} />}
                    Guardar
                </button>
            </div>
        </div>
    )
}

export default SubtareaForm