import { Settings2 } from 'lucide-react'

function ConfigLimiteHoras({ limite, onChange }) {
    return (
        <div className="flex items-center gap-3 bg-white border border-[#E1E4E7] rounded-xl px-4 py-3">
            <Settings2 size={16} className="text-gray-400 shrink-0" />
            <span className="text-sm text-gray-600 font-medium">Límite diario:</span>
            <input
                type="number" min="1" max="24" step="0.5" value={limite}
                onChange={(e) => onChange(parseFloat(e.target.value))}
                className="w-16 px-2 py-1 text-sm border border-[#E1E4E7] rounded-lg focus:ring-2 focus:ring-brand outline-none text-center font-bold"
            />
            <span className="text-sm text-gray-400">horas/día</span>
        </div>
    )
}

export default ConfigLimiteHoras