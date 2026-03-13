import { useState } from 'react'
import { Calendar, Clock, Trash, CheckCircle2, Circle, Pencil, PauseCircle } from 'lucide-react'

const ESTADO_CONFIG = {
  pendiente: { label: 'Pendiente', color: 'bg-gray-100 text-gray-500' },
  hecha:     { label: 'Hecha',     color: 'bg-success-bg text-success-text' },
  pospuesta: { label: 'Pospuesta', color: 'bg-orange-50 text-orange-600' },
}

function SubtareaItem({ sub, onToggle, onEliminar, onEditar, onPosponer }) {
  const [confirmar, setConfirmar] = useState(false)
  const [posponiendo, setPosponiendo] = useState(false)
  const [nota, setNota] = useState('')

  const estado = sub.estado || (sub.completada ? 'hecha' : 'pendiente')
  const esHecha = estado === 'hecha'
  const esPospuesta = estado === 'pospuesta'
  const { label: estadoLabel, color: estadoColor } = ESTADO_CONFIG[estado] || ESTADO_CONFIG.pendiente

  const handlePosponer = () => {
    if (onPosponer) onPosponer(sub, nota)
    setPosponiendo(false)
    setNota('')
  }

  return (
    <div className={`flex items-start gap-4 p-4 rounded-xl border transition-all
      ${esHecha ? 'bg-success-bg border-success-border'
        : esPospuesta ? 'bg-orange-50 border-orange-200'
        : 'bg-white border-[#E1E4E7] hover:border-gray-300'}`}>

      <button type="button" onClick={() => onToggle(sub)}
        className={`shrink-0 mt-0.5 transition-colors ${esHecha ? 'text-success-text' : 'text-gray-300 hover:text-brand'}`}
        aria-label={esHecha ? 'Marcar como pendiente' : 'Marcar como hecha'}>
        {esHecha ? <CheckCircle2 size={22} /> : <Circle size={22} />}
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className={`text-sm font-semibold ${esHecha ? 'line-through text-gray-400' : 'text-[#1A1A1A]'}`}>
            {sub.nombre}
          </p>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${estadoColor}`}>{estadoLabel}</span>
        </div>
        <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-400">
          {sub.fecha_objetivo && (
            <span className="flex items-center gap-1">
              <Calendar size={11} />
              {new Date(sub.fecha_objetivo + 'T00:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
            </span>
          )}
          <span className="flex items-center gap-1"><Clock size={11} />{sub.horas_estimadas}h</span>
        </div>
        {esPospuesta && sub.nota_posposicion && (
          <p className="text-[11px] text-orange-500 mt-1 italic">"{sub.nota_posposicion}"</p>
        )}
        {posponiendo && (
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            <input
              type="text"
              placeholder="Nota opcional"
              value={nota}
              onChange={(e) => setNota(e.target.value)}
              className="flex-1 min-w-0 px-2 py-1 text-xs border border-[#E1E4E7] rounded-lg focus:ring-1 focus:ring-brand outline-none"
            />
            <button type="button" onClick={handlePosponer}
              className="text-xs font-bold px-3 py-1 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition-colors">
              Posponer
            </button>
            <button type="button" onClick={() => { setPosponiendo(false); setNota('') }}
              className="text-xs font-bold px-3 py-1 rounded-lg border border-[#E1E4E7] text-gray-500 hover:border-gray-400 transition-colors">
              Cancelar
            </button>
          </div>
        )}
      </div>

      {!posponiendo && !confirmar && (
        <div className="flex items-center gap-1 shrink-0">
          {onPosponer && !esPospuesta && !esHecha && (
            <button type="button" onClick={() => setPosponiendo(true)}
              className="text-gray-300 hover:text-orange-400 transition-colors"
              aria-label="Posponer subactividad">
              <PauseCircle size={16} />
            </button>
          )}
          {onEditar && (
            <button type="button" onClick={() => onEditar(sub)}
              className="text-gray-300 hover:text-brand transition-colors"
              aria-label="Editar subactividad">
              <Pencil size={15} />
            </button>
          )}
          <button type="button" onClick={() => setConfirmar(true)}
            className="text-gray-300 hover:text-danger-text transition-colors"
            aria-label="Eliminar subactividad">
            <Trash size={16} />
          </button>
        </div>
      )}

      {!posponiendo && confirmar && (
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-xs text-red-500 font-semibold">¿Eliminar?</span>
          <button type="button" onClick={() => { onEliminar(sub.id); setConfirmar(false) }}
            className="px-2 py-1 bg-red-500 text-white rounded-md text-xs font-bold hover:bg-red-600 transition-colors">
            Sí
          </button>
          <button type="button" onClick={() => setConfirmar(false)}
            className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-bold hover:bg-gray-200 transition-colors">
            No
          </button>
        </div>
      )}
    </div>
  )
}

export default SubtareaItem
