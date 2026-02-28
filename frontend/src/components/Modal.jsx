import { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'

// ─── Configuración visual por tipo ────────────────────────────────────────────
const TYPE_CONFIG = {
  error: {
    bg:        'bg-red-50',
    border:    'border-red-200',
    iconBg:    'bg-red-100',
    iconColor: 'text-red-500',
    titleColor:'text-red-800',
    msgColor:  'text-red-600',
    btnColor:  'bg-red-500 hover:bg-red-600 focus:ring-red-400',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
      </svg>
    ),
  },
  warning: {
    bg:        'bg-amber-50',
    border:    'border-amber-200',
    iconBg:    'bg-amber-100',
    iconColor: 'text-amber-500',
    titleColor:'text-amber-800',
    msgColor:  'text-amber-700',
    btnColor:  'bg-amber-500 hover:bg-amber-600 focus:ring-amber-400',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M12 8v4m0 4h.01M12 2a10 10 0 100 20A10 10 0 0012 2z"/>
      </svg>
    ),
  },
  success: {
    bg:        'bg-green-50',
    border:    'border-green-200',
    iconBg:    'bg-green-100',
    iconColor: 'text-green-500',
    titleColor:'text-green-800',
    msgColor:  'text-green-700',
    btnColor:  'bg-green-500 hover:bg-green-600 focus:ring-green-400',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
    ),
  },
  info: {
    bg:        'bg-blue-50',
    border:    'border-blue-200',
    iconBg:    'bg-blue-100',
    iconColor: 'text-blue-500',
    titleColor:'text-blue-800',
    msgColor:  'text-blue-700',
    btnColor:  'bg-blue-500 hover:bg-blue-600 focus:ring-blue-400',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20A10 10 0 0012 2z"/>
      </svg>
    ),
  },
  confirm: {
    bg:        'bg-white',
    border:    'border-gray-200',
    iconBg:    'bg-red-100',
    iconColor: 'text-red-500',
    titleColor:'text-gray-900',
    msgColor:  'text-gray-500',
    btnColor:  'bg-red-500 hover:bg-red-600 focus:ring-red-400',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
      </svg>
    ),
  },
}

// ─── Componente principal ──────────────────────────────────────────────────────
export default function Modal({
  isOpen          = false,
  type            = 'info',
  title           = '',
  message         = '',
  details         = '',          // texto secundario opcional (stack trace, etc.)
  confirmLabel    = 'Aceptar',
  cancelLabel     = 'Cancelar',
  onClose,                       // siempre requerido
  onConfirm,                     // solo para type="confirm"
  closeOnBackdrop = true,
}) {
  const config     = TYPE_CONFIG[type] ?? TYPE_CONFIG.info
  const isConfirm  = type === 'confirm'
  const closeRef   = useRef(null)

  // Foco automático al botón principal al abrir
  useEffect(() => {
    if (isOpen) setTimeout(() => closeRef.current?.focus(), 50)
  }, [isOpen])

  // Cerrar con Escape
  useEffect(() => {
    if (!isOpen) return
    function onKey(e) { if (e.key === 'Escape') onClose?.() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  // Bloquea scroll del body mientras el modal está abierto
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(2px)' }}
      onClick={closeOnBackdrop ? onClose : undefined}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Panel */}
      <div
        className={`relative w-full max-w-md rounded-2xl border shadow-xl
          ${config.bg} ${config.border}
          transition-all duration-200`}
        style={{ animation: 'modalIn 0.18s cubic-bezier(.4,0,.2,1) both' }}
        onClick={e => e.stopPropagation()}
      >
        <style>{`
          @keyframes modalIn {
            from { opacity: 0; transform: scale(0.95) translateY(8px); }
            to   { opacity: 1; transform: scale(1)    translateY(0); }
          }
        `}</style>

        {/* Botón cerrar (×) */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors
            w-7 h-7 flex items-center justify-center rounded-full hover:bg-black/5"
          aria-label="Cerrar"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>

        {/* Contenido */}
        <div className="px-6 pt-6 pb-5">

          {/* Ícono + título */}
          <div className="flex items-start gap-4 mb-3">
            <div className={`shrink-0 w-11 h-11 rounded-full flex items-center justify-center
              ${config.iconBg} ${config.iconColor}`}>
              {config.icon}
            </div>
            <div className="flex-1 pt-1">
              {title && (
                <h2 id="modal-title" className={`font-bold text-base leading-snug ${config.titleColor}`}>
                  {title}
                </h2>
              )}
              {message && (
                <p className={`text-sm mt-1 leading-relaxed ${config.msgColor}`}>
                  {message}
                </p>
              )}
            </div>
          </div>

          {/* Detalles opcionales (colapsados en un bloque de código sutil) */}
          {details && (
            <div className="mt-3 bg-black/5 rounded-lg px-3 py-2.5 text-xs text-gray-500 font-mono
              leading-relaxed max-h-28 overflow-y-auto break-all">
              {details}
            </div>
          )}
        </div>

        {/* Acciones */}
        <div className={`px-6 pb-5 flex gap-2 justify-end
          ${isConfirm ? 'flex-row' : 'flex-row-reverse'}`}>

          {/* Botón primario */}
          <button
            ref={closeRef}
            type="button"
            onClick={isConfirm ? onConfirm : onClose}
            className={`px-5 py-2.5 rounded-xl text-white text-sm font-semibold
              focus:outline-none focus:ring-2 focus:ring-offset-1 transition-colors
              ${config.btnColor}`}
          >
            {confirmLabel}
          </button>

          {/* Botón cancelar (solo en confirm) */}
          {isConfirm && (
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-500
                hover:text-gray-800 hover:bg-gray-100 transition-colors focus:outline-none"
            >
              {cancelLabel}
            </button>
          )}

        </div>
      </div>
    </div>
  )
}


// ─── Hook de conveniencia ──────────────────────────────────────────────────────
// Uso: const { modal, showError, showSuccess, showConfirm, closeModal } = useModal()
// Luego: <Modal {...modal} onClose={closeModal} />

import { useState } from 'react'

export function useModal() {
  const [modal, setModal] = useState({ isOpen: false })

  const closeModal = () => setModal(m => ({ ...m, isOpen: false }))

  const showError = (title, message, details) =>
    setModal({ isOpen: true, type: 'error', title, message, details })

  const showWarning = (title, message) =>
    setModal({ isOpen: true, type: 'warning', title, message })

  const showSuccess = (title, message) =>
    setModal({ isOpen: true, type: 'success', title, message })

  const showInfo = (title, message) =>
    setModal({ isOpen: true, type: 'info', title, message })

  const showConfirm = (title, message, onConfirm, labels = {}) =>
    setModal({
      isOpen: true,
      type: 'confirm',
      title,
      message,
      onConfirm: () => { onConfirm(); closeModal() },
      confirmLabel: labels.confirm ?? 'Confirmar',
      cancelLabel:  labels.cancel  ?? 'Cancelar',
    })

  return { modal, closeModal, showError, showWarning, showSuccess, showInfo, showConfirm }
}

// ─── PropTypes validation ─────────────────────────────────────────────────────
Modal.propTypes = {
  isOpen:          PropTypes.bool,
  type:            PropTypes.oneOf(['error', 'warning', 'success', 'info', 'confirm']),
  title:           PropTypes.string,
  message:         PropTypes.string,
  details:         PropTypes.string,
  confirmLabel:    PropTypes.string,
  cancelLabel:     PropTypes.string,
  onClose:         PropTypes.func,
  onConfirm:       PropTypes.func,
  closeOnBackdrop: PropTypes.bool,
}