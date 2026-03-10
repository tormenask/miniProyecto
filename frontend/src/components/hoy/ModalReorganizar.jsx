import { CheckCircle2, Loader2 } from "lucide-react"
import Modal from "../Modal"

const formatFecha = (fechaStr) => new Date(fechaStr + 'T00:00:00').toLocaleDateString('es-ES', {
    weekday: 'long', day: 'numeric', month: 'long'
})

export default function ModalReorganizar({ open, onClose, hoy, diasDisponibles, seleccion, setSeleccion, moviendo, errorMover, exitoMover, onConfirmar }) {
    const subsExceso = hoy.flatMap(a => a.subactivities || []).filter(s => !s.completada)
        .sort((a, b) => parseFloat(b.horas_estimadas) - parseFloat(a.horas_estimadas))

    return (
        <Modal open={open} onClose={() => !moviendo && onClose()} title="🗓 Reorganizar subtareas">
            <div className="space-y-4">
                {exitoMover ? (
                    <div className="flex flex-col items-center py-6 gap-3">
                        <CheckCircle2 size={40} className="text-green-500" />
                        <p className="text-sm font-bold text-green-600">¡Subtareas movidas con éxito!</p>
                    </div>
                ) : (
                    <>
                        <p className="text-xs text-gray-500">
                            La app encontró los mejores días disponibles. Ajusta el día destino o deselecciona subtareas.
                        </p>

                        <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                            {subsExceso.map(sub => {
                                const actPadre = hoy.find(a => a.subactivities?.some(s => s.id === sub.id))
                                const fechaSel = seleccion[sub.id]
                                return (
                                    <div key={sub.id} className={`p-3 rounded-xl border transition-all ${fechaSel ? 'border-amber-200 bg-amber-50' : 'border-gray-100 bg-gray-50 opacity-60'}`}>
                                        <div className="flex items-start justify-between gap-2 mb-2">
                                            <div>
                                                <p className="text-sm font-bold text-gray-800">{sub.nombre}</p>
                                                <p className="text-xs text-gray-400">{actPadre?.titulo} · {sub.horas_estimadas}h</p>
                                            </div>
                                            <button
                                                onClick={() => setSeleccion(prev => ({ ...prev, [sub.id]: prev[sub.id] ? null : diasDisponibles[0]?.fecha }))}
                                                className={`text-xs font-bold px-2 py-1 rounded-lg transition-colors shrink-0 ${fechaSel ? 'bg-amber-100 text-amber-600 hover:bg-amber-200' : 'bg-gray-200 text-gray-500 hover:bg-gray-300'}`}
                                            >
                                                {fechaSel ? 'Quitar' : 'Incluir'}
                                            </button>
                                        </div>
                                        {fechaSel && (
                                            <select
                                                value={fechaSel}
                                                onChange={e => setSeleccion(prev => ({ ...prev, [sub.id]: e.target.value }))}
                                                className="w-full text-xs px-3 py-2 border border-amber-200 rounded-lg bg-white focus:ring-2 focus:ring-amber-300 outline-none"
                                            >
                                                {diasDisponibles.map(d => (
                                                    <option key={d.fecha} value={d.fecha}>
                                                        {formatFecha(d.fecha)} — {d.horasLibres}h libres
                                                    </option>
                                                ))}
                                            </select>
                                        )}
                                    </div>
                                )
                            })}
                        </div>

                        {errorMover && <p className="text-xs text-red-500 font-medium">{errorMover}</p>}

                        <div className="flex gap-2 pt-1">
                            <button onClick={onClose} disabled={moviendo}
                                className="flex-1 py-2.5 rounded-lg border border-gray-200 text-gray-500 text-sm font-bold hover:border-gray-300 transition-colors disabled:opacity-50">
                                Cancelar
                            </button>
                            <button onClick={onConfirmar} disabled={moviendo || Object.values(seleccion).every(v => !v)}
                                className="flex-1 bg-amber-500 hover:bg-amber-600 text-white py-2.5 rounded-lg text-sm font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                                {moviendo ? <><Loader2 className="animate-spin" size={14} />Moviendo...</> : 'Confirmar'}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </Modal>
    )
}