// Modal reutilizable.
// UX #3 Control y libertad: se cierra con Escape o haciendo clic fuera.
// UX #8 Diseño minimalista: backdrop semitransparente, card centrada.
import { useEffect } from 'react'
import { X } from 'lucide-react'

export default function Modal({ open, onClose, title, children, maxWidth = 'max-w-md' }) {
  // UX #7 Eficiencia: Escape cierra el modal
  useEffect(() => {
    if (!open) return
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
      onClick={onClose}
    >
      {/* Detener propagación para que clic dentro no cierre el modal */}
      <div
        className={`bg-white rounded-xl shadow-xl w-full ${maxWidth} animate-in`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-card-head">
            <h2 className="text-base font-bold text-[#1A1A1A]">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-700 transition-colors"
              aria-label="Cerrar"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* Body */}
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  )
}
