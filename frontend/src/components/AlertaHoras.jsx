import { AlertTriangle, X } from 'lucide-react'

function AlertaHoras({ conflictos, limite, onMoverDia, onReducirHoras, onCerrar }) {
    if (!conflictos || conflictos.length === 0) return null

    return (
        <div role="alert" aria-live="polite" className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                    <AlertTriangle size={18} className="text-yellow-500 shrink-0" />
                    <p className="text-sm font-bold text-yellow-800">
                        Límite de {limite}h/día superado
                    </p>
                </div>
                <button onClick={onCerrar} aria-label="Cerrar alerta" className="text-yellow-400 hover:text-yellow-600 transition-colors">
                    <X size={16} />
                </button>
            </div>

            {conflictos.map(({ fecha, horas }) => (
                <div key={fecha} className="bg-white border border-yellow-100 rounded-lg p-3">
                    <p className="text-xs text-gray-600 mb-2">
                        <span className="font-bold text-yellow-700">
                            {new Date(fecha + 'T00:00:00').toLocaleDateString('es-ES', {
                                weekday: 'long', day: 'numeric', month: 'long'
                            })}
                        </span>
                        {' '}— {horas}h planeadas (límite: {limite}h)
                    </p>
                    <div className="flex gap-2">
                        <button type="button" onClick={() => onMoverDia(fecha)}
                            className="flex-1 text-xs font-bold px-3 py-1.5 rounded-lg border border-yellow-300 text-yellow-700 hover:bg-yellow-50 transition-colors">
                            <span aria-hidden="true">📅 </span>Mover subactividad de día
                        </button>
                        <button type="button" onClick={() => onReducirHoras(fecha)}
                            className="flex-1 text-xs font-bold px-3 py-1.5 rounded-lg border border-yellow-300 text-yellow-700 hover:bg-yellow-50 transition-colors">
                            <span aria-hidden="true">⏱ </span>Reducir horas estimadas
                        </button>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default AlertaHoras