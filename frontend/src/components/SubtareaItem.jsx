// Item individual de subtarea.
// Completada → paleta success (#DCF1E3 / #1B4332). UX #9 feedback visual claro.
import { Calendar, Clock, Trash, CheckCircle2, Circle } from 'lucide-react'

function SubtareaItem({ sub, onToggle, onEliminar }) {
  return (
    <div className={`flex items-center gap-4 p-4 rounded-xl border transition-all
      ${sub.completada
        ? 'bg-success-bg border-success-border'
        : 'bg-white border-[#E1E4E7] hover:border-gray-300'
      }`}
    >
      {/* UX #1 Visibilidad: feedback inmediato al marcar completada */}
      <button
        onClick={() => onToggle(sub)}
        className={`shrink-0 transition-colors ${sub.completada ? 'text-success-text' : 'text-gray-300 hover:text-brand'}`}
      >
        {sub.completada ? <CheckCircle2 size={22} /> : <Circle size={22} />}
      </button>

      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold ${sub.completada ? 'line-through text-gray-400' : 'text-[#1A1A1A]'}`}>
          {sub.nombre}
        </p>
        <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <Calendar size={11} />
            {new Date(sub.fecha_objetivo + 'T00:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={11} />
            {sub.horas_estimadas}h
          </span>
        </div>
      </div>

      <button
        onClick={() => onEliminar(sub.id)}
        className="shrink-0 text-gray-300 hover:text-danger-text transition-colors"
        aria-label="Eliminar subactividad"
      >
        <Trash size={16} />
      </button>
    </div>
  )
}

export default SubtareaItem
