import { Calendar, BookOpen } from "lucide-react"

const TIPO_LABELS = { exam: "Examen", quiz: "Quiz", workshop: "Taller", project: "Proyecto", other: "Otro" }

function TaskCard({ actividad, onClick, variante = "proximas" }) {
    const borderColor = {
        vencidas: "border-l-red-400",
        hoy: "border-l-amber-400",
        proximas: "border-l-green-400"
    }[variante]

    return (
        <div
            onClick={onClick}
            className={`bg-white rounded-lg p-5 border border-gray-100 border-l-4 ${borderColor}
        hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer`}
        >
            <p className="text-sm font-bold text-gray-900 mb-1 leading-snug">{actividad.titulo}</p>

            <div className="flex items-center gap-1 text-xs text-gray-400 mb-3">
                <BookOpen size={11} />
                <span>{actividad.curso}</span>
                <span className="mx-1">·</span>
                <span>{TIPO_LABELS[actividad.tipo] || actividad.tipo}</span>
            </div>

            {actividad.fecha_limite && (
                <div className="flex items-center gap-1 text-xs text-gray-500 mt-auto">
                    <Calendar size={11} />
                    <span>
                        {new Date(actividad.fecha_limite).toLocaleDateString("es-ES", {
                            timeZone: "America/Bogota", day: "numeric", month: "short", year: "numeric"
                        })}
                    </span>
                </div>
            )}
        </div>
    )
}

export default TaskCard