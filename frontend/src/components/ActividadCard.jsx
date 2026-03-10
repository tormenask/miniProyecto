import { Calendar, Clock, BookOpen, ExternalLink } from 'lucide-react'

const TZ = 'America/Bogota'
const toBogotaDate = (d) => d.toLocaleDateString('en-CA', { timeZone: TZ })

const TIPO_LABELS = { exam: 'Examen', quiz: 'Quiz', workshop: 'Taller', project: 'Proyecto', other: 'Otro' }
const TIPO_COLORS = {
    exam: 'bg-red-100 text-red-700',
    quiz: 'bg-yellow-100 text-yellow-700',
    workshop: 'bg-blue-100 text-blue-700',
    project: 'bg-purple-100 text-purple-700',
    other: 'bg-gray-100 text-gray-600'
}

function ActividadCard({ actividad, onClick }) {
    const subtareas = actividad.subactivities || []
    const completadas = subtareas.filter(s => s.completada).length
    const pendientes = subtareas.filter(s => !s.completada).length
    const total = subtareas.length
    const porcentaje = total > 0 ? Math.round((completadas / total) * 100) : 0

    const fechaLimite = actividad.fecha_limite ? new Date(actividad.fecha_limite) : null
    const hoyStr = toBogotaDate(new Date())
    const limiteStr = fechaLimite ? toBogotaDate(fechaLimite) : null
    const esVencida = limiteStr && limiteStr < hoyStr
    const esHoy = limiteStr === hoyStr

    return (
        <div
            onClick={onClick}
            className="bg-white rounded-xl border border-[#E1E4E7] hover:shadow-md transition-all cursor-pointer p-5"
        >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${TIPO_COLORS[actividad.tipo]}`}>
                        {TIPO_LABELS[actividad.tipo] || actividad.tipo}
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-gray-100 text-gray-600 flex items-center gap-1">
                        <BookOpen size={11} /> {actividad.curso}
                    </span>
                    {esVencida && (
                        <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-red-50 text-red-500 flex items-center gap-1">
                            <Clock size={11} /> Vencida
                        </span>
                    )}
                    {esHoy && (
                        <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-yellow-50 text-yellow-600 flex items-center gap-1">
                            <Clock size={11} /> Hoy
                        </span>
                    )}
                </div>
                <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-brand transition-colors shrink-0 font-semibold border border-[#E1E4E7] px-3 py-1.5 rounded-lg">
                    Ver detalle <ExternalLink size={12} />
                </button>
            </div>

            {/* Título */}
            <h3 className="text-base font-bold text-[#1A1A1A] mb-3">{actividad.titulo}</h3>

            {/* Progreso subtareas */}
            {total > 0 && (
                <>
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
                        <span>{completadas} de {total} subactividades completadas</span>
                        <span className="text-brand font-bold">{porcentaje}%</span>
                    </div>
                    <div className="w-full bg-red-100 rounded-full h-2 mb-3">
                        <div
                            className="bg-brand h-2 rounded-full transition-all"
                            style={{ width: `${porcentaje}%` }}
                        />
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                            {completadas} completadas
                        </span>
                        <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-gray-300 inline-block" />
                            {pendientes} pendientes
                        </span>
                    </div>
                </>
            )}

            {/* Sin subtareas */}
            {total === 0 && fechaLimite && (
                <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-1">
                    <Calendar size={12} />
                    <span>
                        {fechaLimite.toLocaleDateString('es-ES', {
                            timeZone: TZ, weekday: 'short', day: 'numeric', month: 'short'
                        })}
                    </span>
                </div>
            )}
        </div>
    )
}

export default ActividadCard