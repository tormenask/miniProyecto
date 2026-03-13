import { Clock, CheckCircle2, AlertTriangle, TrendingUp, Zap } from "lucide-react"

function ResumenHoras({ hoy, vencidas, proximas, limite }) {
    // Items are now subtareas directly (new backend format)
    const horasTotalesHoy = hoy.reduce((acc, s) => acc + parseFloat(s.horas_estimadas || 0), 0)
    const horasCompletadasHoy = hoy.filter(s => s.estado === 'hecha' || s.completada).reduce((acc, s) => acc + parseFloat(s.horas_estimadas || 0), 0)
    const horasPendientesHoy = horasTotalesHoy - horasCompletadasHoy
    const horasVencidas = vencidas.filter(s => s.estado !== 'hecha' && !s.completada).reduce((acc, s) => acc + parseFloat(s.horas_estimadas || 0), 0)
    const horasProximas = proximas.reduce((acc, s) => acc + parseFloat(s.horas_estimadas || 0), 0)
    const superaLimite = horasTotalesHoy > limite
    const porcentajeCompletado = horasTotalesHoy > 0 ? Math.round((horasCompletadasHoy / horasTotalesHoy) * 100) : 0

    return (
        <div className="bg-white rounded-xl border border-gray-200 px-5 py-4 mb-6 flex flex-wrap items-center gap-4">

            {/* Hero: horas + barra */}
            <div className="flex items-center gap-3 pr-4 border-r border-gray-100">
                <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center shrink-0">
                    <Zap size={13} className="text-yellow-400" />
                </div>
                <div>
                    <p className="text-xs text-gray-400 font-medium leading-none mb-1">Hoy</p>
                    <div className="flex items-baseline gap-1">
                        <span className="text-xl font-black text-gray-900">{horasTotalesHoy}h</span>
                        <span className="text-xs text-gray-400">/ {limite}h</span>
                        {superaLimite && (
                            <span className="flex items-center gap-0.5 text-[10px] font-bold text-amber-500 ml-1">
                                <AlertTriangle size={9} /> +{(horasTotalesHoy - limite).toFixed(1)}h
                            </span>
                        )}
                    </div>
                    <div className="w-24 bg-gray-100 rounded-full h-1 mt-1">
                        <div
                            className={`h-1 rounded-full transition-all duration-500 ${superaLimite ? 'bg-amber-400' : 'bg-green-400'}`}
                            style={{ width: `${Math.min((horasTotalesHoy / limite) * 100, 100)}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Métricas */}
            {[
                { label: 'Completadas', valor: horasCompletadasHoy, sub: `${porcentajeCompletado}%`, icon: <CheckCircle2 size={12} />, color: 'text-green-500' },
                { label: 'Pendientes', valor: horasPendientesHoy, sub: `${hoy.filter(s => s.estado !== 'hecha' && !s.completada).length} sub`, icon: <Clock size={12} />, color: 'text-orange-400' },
                { label: 'Vencidas', valor: horasVencidas, sub: `${vencidas.length} sub`, icon: <TrendingUp size={12} />, color: 'text-red-400' },
                { label: 'Próximas', valor: horasProximas, sub: `${proximas.length} sub`, icon: <Clock size={12} />, color: 'text-blue-400' },
            ].map(({ label, valor, sub, icon, color }) => (
                <div key={label} className="flex items-center gap-2 pr-4 border-r border-gray-100 last:border-0 last:pr-0">
                    <span className={color}>{icon}</span>
                    <div>
                        <p className="text-[10px] text-gray-400 font-medium leading-none mb-0.5">{label}</p>
                        <div className="flex items-baseline gap-1">
                            <span className="text-sm font-black text-gray-800">{valor}h</span>
                            <span className="text-[10px] text-gray-400">{sub}</span>
                        </div>
                    </div>
                </div>
            ))}

        </div>
    )
}

export default ResumenHoras
