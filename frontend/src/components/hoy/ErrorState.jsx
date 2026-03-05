import { RefreshCw, Wifi } from "lucide-react"

function ErrorIllustration() {
    return (
        <svg width="160" height="130" viewBox="0 0 160 130" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Cuerpo robot */}
            <rect x="50" y="45" width="60" height="50" rx="8" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1.5" />
            {/* Cabeza robot */}
            <rect x="58" y="25" width="44" height="28" rx="6" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1.5" />
            {/* Antena */}
            <line x1="80" y1="25" x2="80" y2="16" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
            <circle cx="80" cy="13" r="3" fill="#fca5a5" stroke="#f87171" strokeWidth="1" />
            {/* Ojos tristes */}
            <circle cx="70" cy="37" r="4" fill="white" stroke="#94a3b8" strokeWidth="1.5" />
            <circle cx="90" cy="37" r="4" fill="white" stroke="#94a3b8" strokeWidth="1.5" />
            <circle cx="70" cy="38" r="2" fill="#94a3b8" />
            <circle cx="90" cy="38" r="2" fill="#94a3b8" />
            {/* Boca triste */}
            <path d="M72 48 Q80 44 88 48" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            {/* Brazos */}
            <rect x="34" y="52" width="16" height="8" rx="4" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1.5" />
            <rect x="110" y="52" width="16" height="8" rx="4" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1.5" />
            {/* Piernas */}
            <rect x="60" y="93" width="12" height="16" rx="4" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1.5" />
            <rect x="88" y="93" width="12" height="16" rx="4" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1.5" />
            {/* Herramientas en el suelo */}
            <line x1="30" y1="115" x2="55" y2="110" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
            <circle cx="28" cy="116" r="4" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1.5" />
            <line x1="105" y1="110" x2="130" y2="115" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
            <circle cx="132" cy="116" r="4" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1.5" />
            {/* Suelo */}
            <line x1="15" y1="122" x2="145" y2="122" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" />
        </svg>
    )
}

function ErrorState({ onReintentar }) {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <ErrorIllustration />
            <h2 className="text-xl font-bold text-gray-800 mb-2 mt-2">No pudimos cargar tus tareas.</h2>
            <p className="text-sm text-gray-500 mb-8 max-w-xs">
                Puede que haya un problema con tu conexión. Verifica tu internet e intenta de nuevo.
            </p>
            <div className="flex items-center gap-3">
                <button
                    onClick={onReintentar}
                    className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors"
                >
                    <RefreshCw size={16} /> Reintentar
                </button>
                <button className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-black transition-colors">
                    <Wifi size={16} /> Verificar conexión
                </button>
            </div>
        </div>
    )
}

export default ErrorState