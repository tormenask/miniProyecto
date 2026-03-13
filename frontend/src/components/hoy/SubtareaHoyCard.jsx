import { useState } from 'react'
import { CheckCircle2, Circle, PauseCircle, BookOpen, Calendar, Clock, CalendarClock } from 'lucide-react'
import ConflictoModal from '../ConflictoModal'
import useReprogramar from '../../hooks/useReprogramar'

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

const BORDER = {
  vencidas: 'border-l-red-400',
  hoy: 'border-l-amber-400',
  proximas: 'border-l-green-400',
}

const ESTADO_CONFIG = {
  pendiente: { label: 'Pendiente', color: 'bg-gray-100 text-gray-500' },
  hecha:     { label: 'Hecha',     color: 'bg-success-bg text-success-text' },
  pospuesta: { label: 'Pospuesta', color: 'bg-orange-50 text-orange-600' },
}

function SubtareaHoyCard({ sub, actividadId, actividadTitulo, actividadCurso, variante, onRefresh }) {
  const [posponiendo, setPosponiendo] = useState(false)
  const [reprogramando, setReprogramando] = useState(false)
  const [nota, setNota] = useState('')
  const [cargandoLocal, setCargandoLocal] = useState(false)

  const { reprogramar, resolverConflicto, limpiarConflicto, conflicto, cargando: cargandoReprog, error: errorReprog } = useReprogramar()

  const estado = sub.estado || (sub.completada ? 'hecha' : 'pendiente')
  const esHecha = estado === 'hecha'
  const { label: estadoLabel, color: estadoColor } = ESTADO_CONFIG[estado] || ESTADO_CONFIG.pendiente

  const patch = async (body) => {
    const token = localStorage.getItem('access_token')
    setCargandoLocal(true)
    try {
      await fetch(`${API_URL}/api/activities/${actividadId}/subtasks/${sub.id}/`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      onRefresh()
    } finally {
      setCargandoLocal(false)
    }
  }

  const handleToggle = () => patch({ estado: esHecha ? 'pendiente' : 'hecha' })

  const handlePosponer = () => {
    patch({ estado: 'pospuesta', nota_posposicion: nota })
    setPosponiendo(false)
    setNota('')
  }

  const handleCambiarFecha = async (e) => {
    const nuevaFecha = e.target.value
    if (!nuevaFecha) return
    setReprogramando(false)
    const updated = await reprogramar(actividadId, sub.id, nuevaFecha)
    if (updated) onRefresh()
    // si null → conflicto gestionado por useReprogramar, modal se abre
  }

  const handleResolverConflicto = async (body) => {
    const updated = await resolverConflicto(body)
    if (updated) onRefresh()
    return updated
  }

  const cargando = cargandoLocal || cargandoReprog

  return (
    <>
      <div className={`bg-white rounded-lg p-4 border border-gray-100 border-l-4 ${BORDER[variante] || BORDER.proximas}
        ${esHecha ? 'opacity-60' : ''} transition-all`}>

        <div className="flex items-start gap-3">
          <button type="button" onClick={handleToggle} disabled={cargando}
            className={`shrink-0 mt-0.5 transition-colors ${esHecha ? 'text-success-text' : 'text-gray-300 hover:text-brand'}`}
            aria-label={esHecha ? 'Marcar como pendiente' : 'Marcar como hecha'}>
            {esHecha ? <CheckCircle2 size={20} /> : <Circle size={20} />}
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <p className={`text-sm font-semibold ${esHecha ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                {sub.nombre}
              </p>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${estadoColor}`}>{estadoLabel}</span>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-400 flex-wrap">
              <span className="flex items-center gap-1"><BookOpen size={10} />{actividadCurso} · {actividadTitulo}</span>
              {sub.fecha_objetivo && (
                <span className="flex items-center gap-1">
                  <Calendar size={10} />
                  {new Date(sub.fecha_objetivo + 'T00:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                </span>
              )}
              <span className="flex items-center gap-1"><Clock size={10} />{sub.horas_estimadas}h</span>
            </div>

            {estado === 'pospuesta' && sub.nota_posposicion && (
              <p className="text-[11px] text-orange-500 mt-1 italic">"{sub.nota_posposicion}"</p>
            )}

            {/* Datepicker de reprogramación */}
            {reprogramando && (
              <div className="mt-2 flex items-center gap-2 flex-wrap">
                <input
                  type="date"
                  defaultValue={sub.fecha_objetivo?.slice(0, 10) || ''}
                  onChange={handleCambiarFecha}
                  min={new Date().toISOString().slice(0, 10)}
                  aria-label={`Cambiar fecha de ${sub.nombre}`}
                  className="text-xs border border-[#E1E4E7] rounded-lg px-2 py-1 focus:ring-1 focus:ring-brand outline-none"
                />
                <button type="button" onClick={() => setReprogramando(false)}
                  className="text-xs font-bold px-3 py-1 rounded-lg border border-[#E1E4E7] text-gray-500 hover:border-gray-400 transition-colors">
                  Cancelar
                </button>
              </div>
            )}

            {/* Input de posposición */}
            {posponiendo && (
              <div className="mt-2 flex items-center gap-2 flex-wrap">
                <input type="text" placeholder="Nota opcional" value={nota}
                  onChange={e => setNota(e.target.value)}
                  className="flex-1 min-w-0 px-2 py-1 text-xs border border-[#E1E4E7] rounded-lg focus:ring-1 focus:ring-brand outline-none" />
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

          {/* Botones de acción */}
          {!posponiendo && !reprogramando && estado !== 'hecha' && (
            <div className="flex items-center gap-1 shrink-0 mt-0.5">
              {/* Reprogramar */}
              <button type="button" onClick={() => setReprogramando(true)} disabled={cargando}
                className="text-gray-300 hover:text-brand transition-colors"
                aria-label="Reprogramar subtarea">
                <CalendarClock size={15} />
              </button>
              {/* Posponer */}
              {estado !== 'pospuesta' && (
                <button type="button" onClick={() => setPosponiendo(true)} disabled={cargando}
                  className="text-gray-300 hover:text-orange-400 transition-colors"
                  aria-label="Posponer subactividad">
                  <PauseCircle size={16} />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal de conflicto */}
      <ConflictoModal
        open={!!conflicto}
        onClose={limpiarConflicto}
        conflictoData={conflicto?.data}
        currentFecha={sub.fecha_objetivo?.slice(0, 10)}
        onResolver={handleResolverConflicto}
        cargando={cargandoReprog}
        errorExterno={errorReprog}
      />
    </>
  )
}

export default SubtareaHoyCard
