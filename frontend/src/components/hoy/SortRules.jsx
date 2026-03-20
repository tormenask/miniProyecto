import { Info } from "lucide-react"

function SortRules() {
    return (
        <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl px-5 py-4 mb-4">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                <Info size={15} className="text-blue-500" />
            </div>
            <div className="flex flex-col gap-1.5 text-sm text-gray-900">
                <p>
                    <span className="font-semibold">1.</span> Tus actividades se agrupan según su fecha límite:{" "}
                    <span className="text-red-400 font-semibold">Vencidas</span>,{" "}
                    <span className="text-amber-400 font-semibold">Hoy</span> y{" "}
                    <span className="text-green-500 font-semibold">Próximas</span>.
                </p>
                <p>
                    <span className="font-semibold">2.</span> Orden: vencidas más antiguas primero, próximas más cercanas primero.
                </p>
                <p>
                    <span className="font-semibold">3.</span> En caso de empate, se prioriza la de menor esfuerzo estimado.
                </p>
            </div>
        </div>
    )
}

export default SortRules