// Alerta unificada con tres variantes semánticas.
// UX #9 Recuperación de errores: colores distintos por tipo para comunicar gravedad.
import { AlertCircle, CheckCircle2, AlertTriangle } from 'lucide-react'

const VARIANTS = {
  danger: {
    wrapper: 'bg-danger-bg border border-danger-border text-danger-text',
    Icon: AlertCircle,
  },
  success: {
    wrapper: 'bg-success-bg border border-success-border text-success-text',
    Icon: CheckCircle2,
  },
  warning: {
    wrapper: 'bg-warning-bg border border-warning-border text-warning-text',
    Icon: AlertTriangle,
  },
}

export default function Alert({ mensaje, type = 'danger' }) {
  if (!mensaje) return null
  const { wrapper, Icon } = VARIANTS[type] ?? VARIANTS.danger

  return (
    <div role="alert" className={`flex items-start gap-2 px-4 py-3 rounded-lg text-sm font-medium ${wrapper}`}>
      <Icon size={16} className="shrink-0 mt-0.5" />
      <span>{mensaje}</span>
    </div>
  )
}
