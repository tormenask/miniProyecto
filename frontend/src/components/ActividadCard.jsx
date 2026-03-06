import { Calendar, ChevronRight, Clock, BookOpen } from 'lucide-react'

const TZ = 'America/Bogota'
// Devuelve "YYYY-MM-DD" en zona Bogotá para comparar fechas sin depender del timestamp exacto.
const toBogotaDate = (d) => d.toLocaleDateString('en-CA', { timeZone: TZ })

function ActividadCard({ actividad, onClick }) {
    const fechaLimite = actividad.fecha_limite
        ? new Date(actividad.fecha_limite)
        : null

    const hoyStr     = toBogotaDate(new Date())
    const limiteStr  = fechaLimite ? toBogotaDate(fechaLimite) : null

    const esVencida = limiteStr && limiteStr < hoyStr
    const esHoy     = limiteStr === hoyStr

    const badgeColor = esVencida
        ? 'bg-danger-bg text-danger-text'
        : esHoy
            ? 'bg-warning-bg text-warning-text'
            : 'bg-success-bg text-success-text'

    return (
        <div
            onClick={onClick}
            className="group bg-white p-5 rounded-xl shadow-sm border border-[#E1E4E7] hover:border-brand/40 hover:shadow-md transition-all cursor-pointer flex items-center justify-between"
        >
            <div className="flex items-center gap-5">
                <div className="bg-app-bg p-3.5 rounded-xl text-gray-400 group-hover:bg-danger-bg group-hover:text-brand transition-colors">
                    <Calendar size={24} />
                </div>
                <div className="min-w-0">
                    <h3 className="text-sm font-bold text-[#1A1A1A] group-hover:text-brand transition-colors truncate">
                        {actividad.titulo}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                            <BookOpen size={13} />
                            {actividad.curso}
                        </span>
                        <span className="bg-card-head text-gray-600 px-2 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider">
                            {actividad.tipo}
                        </span>
                    </div>
                    {fechaLimite && (
                        <div className={`flex items-center gap-1.5 mt-2.5 text-[11px] font-bold w-fit px-2 py-1 rounded-md ${badgeColor}`}>
                            <Clock size={11} />
                            {esHoy
                                ? 'Hoy'
                                : fechaLimite.toLocaleDateString('es-ES', {
                                    timeZone: TZ, weekday: 'short', day: 'numeric', month: 'short'
                                })
                            }
                        </div>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-4 shrink-0">
                {actividad.fecha_creacion && (
                    <div className="hidden sm:block text-right">
                        <p className="text-[10px] uppercase font-black text-gray-300 tracking-widest">Creado</p>
                        <p className="text-xs text-gray-400">
                            {new Date(actividad.fecha_creacion).toLocaleDateString('es-ES', {
                                day: 'numeric', month: 'short'
                            })}
                        </p>
                    </div>
                )}
                <ChevronRight className="text-gray-300 group-hover:text-brand group-hover:translate-x-1 transition-all" size={20} />
            </div>
        </div>
    )
}

export default ActividadCard
