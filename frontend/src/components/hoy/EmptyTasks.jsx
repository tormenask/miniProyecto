import { Plus } from "lucide-react"

function EmptyIllustration() {
    return (
        <svg width="160" height="120" viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Sol */}
            <circle cx="80" cy="40" r="18" fill="#fef9c3" stroke="#fde68a" strokeWidth="2" />
            <line x1="80" y1="14" x2="80" y2="8" stroke="#fde68a" strokeWidth="2" strokeLinecap="round" />
            <line x1="80" y1="72" x2="80" y2="66" stroke="#fde68a" strokeWidth="2" strokeLinecap="round" />
            <line x1="54" y1="40" x2="48" y2="40" stroke="#fde68a" strokeWidth="2" strokeLinecap="round" />
            <line x1="112" y1="40" x2="106" y2="40" stroke="#fde68a" strokeWidth="2" strokeLinecap="round" />
            <line x1="62" y1="22" x2="57" y2="17" stroke="#fde68a" strokeWidth="2" strokeLinecap="round" />
            <line x1="103" y1="57" x2="98" y2="62" stroke="#fde68a" strokeWidth="2" strokeLinecap="round" />
            <line x1="98" y1="22" x2="103" y2="17" stroke="#fde68a" strokeWidth="2" strokeLinecap="round" />
            <line x1="57" y1="57" x2="62" y2="62" stroke="#fde68a" strokeWidth="2" strokeLinecap="round" />
            {/* Personaje - cuerpo */}
            <circle cx="80" cy="85" r="12" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1.5" />
            {/* Personaje - cara feliz */}
            <circle cx="76" cy="83" r="1.5" fill="#94a3b8" />
            <circle cx="84" cy="83" r="1.5" fill="#94a3b8" />
            <path d="M76 88 Q80 91 84 88" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            {/* Suelo */}
            <line x1="20" y1="108" x2="140" y2="108" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" />
            <line x1="10" y1="112" x2="150" y2="112" stroke="#f1f5f9" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    )
}

function EmptyTasks({ onCrear }) {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <EmptyIllustration />
            <h2 className="text-xl font-bold text-gray-800 mb-2 mt-2">¡Ya estás al día por hoy!</h2>
            <p className="text-sm text-gray-500 mb-8 max-w-xs">
                Disfruta de tu tiempo libre o añade una nueva tarea a continuación.
            </p>
            <button
                onClick={onCrear}
                className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors"
            >
                <Plus size={16} /> Crear tarea
            </button>
        </div>
    )
}

export default EmptyTasks