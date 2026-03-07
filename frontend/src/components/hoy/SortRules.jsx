import { Info } from "lucide-react"

function SortRules() {
    return (
        <div className="flex items-start gap-2 text-sm text-gray-400 mb-2">
            <Info size={14} className="shrink-0 mt-0.5" />
            <p>
                Tus actividades se agrupan según su fecha límite:{" "}
                <span className="text-red-400 font-semibold">Vencidas</span> (fecha ya pasada),{" "}
                <span className="text-amber-400 font-semibold">Hoy</span> (fecha actual) y{" "}
                <span className="text-green-500 font-semibold">Próximas</span> (fecha futura).
            </p>
        </div>
    )
}

export default SortRules