import { Info } from "lucide-react"

function SortRules() {
    return (
        <div className="bg-slate-50 border border-slate-100 rounded-lg px-4 py-3 flex items-start gap-3">
            <Info size={15} className="text-slate-400 mt-0.5 shrink-0" />
            <div className="space-y-1">
                <p className="text-sm text-slate-500"><span className="font-semibold text-slate-600">Vencidas:</span> actividades cuya fecha límite ya pasó.</p>
                <p className="text-sm text-slate-500"><span className="font-semibold text-slate-600">Hoy:</span> actividades con fecha límite para el día de hoy.</p>
                <p className="text-sm text-slate-500"><span className="font-semibold text-slate-600">Próximas:</span> actividades con fecha límite en los próximos días.</p>
            </div>
        </div>
    )
}

export default SortRules