import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'

const FOCUSABLE = 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

export default function Modal({ open, onClose, title, children, maxWidth = 'max-w-md' }) {
  const modalRef = useRef(null)
  const titleId = 'modal-title'

  // Cerrar con Escape
  useEffect(() => {
    if (!open) return
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  // Focus trap: mueve el foco al modal al abrirse y lo atrapa dentro con Tab
  useEffect(() => {
    if (!open || !modalRef.current) return
    const el = modalRef.current
    const focusable = [...el.querySelectorAll(FOCUSABLE)]
    focusable[0]?.focus()

    const trapTab = (e) => {
      if (e.key !== 'Tab' || focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus() }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }
    el.addEventListener('keydown', trapTab)
    return () => el.removeEventListener('keydown', trapTab)
  }, [open])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
      onClick={onClose}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        className={`bg-white rounded-xl shadow-xl w-full ${maxWidth} animate-in`}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-card-head">
            <h2 id={titleId} className="text-base font-bold text-[#1A1A1A]">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-700 transition-colors"
              aria-label="Cerrar"
            >
              <X size={18} />
            </button>
          </div>
        )}
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  )
}
