import { Circle } from "lucide-react"

function TaskCard({ actividad, onClick }) {
    return (
        <div
            onClick={onClick}
            className="bg-white rounded-lg p-4 border border-gray-100 hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer flex items-center gap-3"
        >
            <Circle size={18} className="text-gray-300 shrink-0" />
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">{actividad.titulo}</p>
                <p className="text-xs text-gray-400 mt-0.5">{actividad.curso} · {actividad.tipo}</p>
            </div>
            {actividad.fecha_limite && (
                <span className="text-xs text-red-500 font-bold shrink-0">
                    {new Date(actividad.fecha_limite).toLocaleDateString("es-ES", {
                        timeZone: "America/Bogota", day: "numeric", month: "short"
                    })}
                </span>
            )}
        </div>
    )
}

export default TaskCard