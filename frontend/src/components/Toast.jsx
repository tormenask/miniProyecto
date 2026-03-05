import { useEffect, useState } from 'react'
import { CheckCircle2, X } from 'lucide-react'

export default function Toast({ mensaje, duracion = 2500, onClose }) {
  const [progreso, setProgreso] = useState(100)

  useEffect(() => {
    if (!mensaje) return
    setProgreso(100)
    const inicio = Date.now()
    const tick = setInterval(() => {
      const pct = Math.max(0, 100 - ((Date.now() - inicio) / duracion) * 100)
      setProgreso(pct)
      if (pct === 0) {
        clearInterval(tick)
        onClose?.()
      }
    }, 30)
    return () => clearInterval(tick)
  }, [mensaje])

  if (!mensaje) return null

  return (
    <div className="fixed top-16 right-4 z-50 w-80 bg-success-bg border border-success-border rounded-xl shadow-xl overflow-hidden">
      <div className="flex items-start gap-3 px-4 py-3">
        <CheckCircle2 size={20} className="text-success-text shrink-0 mt-0.5" />
        <p className="text-sm font-semibold text-success-text flex-1 leading-snug">{mensaje}</p>
        <button
          onClick={() => { setProgreso(0); onClose?.() }}
          className="text-success-text/60 hover:text-success-text transition-colors ml-1 shrink-0"
        >
          <X size={15} />
        </button>
      </div>
      <div className="bg-success-border h-1">
        <div
          className="h-1 bg-success-text"
          style={{ width: `${progreso}%`, transition: 'width 30ms linear' }}
        />
      </div>
    </div>
  )
}
