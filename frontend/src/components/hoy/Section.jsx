import TaskCard from "./TaskCard"

const CONFIG = {
    vencidas: {
        label: "Vencidas",
        textColor: "text-red-500",
        bgColor: "bg-red-50",
        badgeColor: "bg-red-100 text-red-600"
    },
    hoy: {
        label: "Hoy",
        textColor: "text-amber-500",
        bgColor: "bg-amber-50",
        badgeColor: "bg-amber-100 text-amber-600"
    },
    proximas: {
        label: "Próximas",
        textColor: "text-green-600",
        bgColor: "bg-green-50",
        badgeColor: "bg-green-100 text-green-700"
    }
}

function Section({ variante, items, onClickItem }) {
    const { label, textColor, bgColor, badgeColor } = CONFIG[variante]

    return (
        <div className={`${bgColor} rounded-2xl p-4 min-h-40`}>
            <div className="flex items-center justify-between mb-4">
                <p className={`text-xs font-black uppercase tracking-widest ${textColor}`}>{label}</p>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${badgeColor}`}>
                    {items.length}
                </span>
            </div>

            {items.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-6">Sin actividades</p>
            ) : (
                <div className="space-y-3">
                    {items.map((act) => (
                        <TaskCard
                            key={act.id}
                            actividad={act}
                            variante={variante}
                            onClick={() => onClickItem(act.id)}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export default Section