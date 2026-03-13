import { useState } from 'react'
import { Loader2, X } from 'lucide-react'
import { formatearFechaSugerencia } from '../utils/formatDate'

/**
 * Modal de conflicto de sobrecarga (409).
 *
 * Recibe el payload raw del backend:
 *   conflictoData = { mensaje, horas_planificadas, horas_nuevas, limite,
 *                     max_horas_permitidas, puede_reducir, sugerencias }
 *
 * Props:
 *   open             – boolean
 *   onClose          – () => void  (cancelar, no guarda)
 *   conflictoData    – objeto 409 del backend
 *   currentFecha     – fecha_objetivo actual de la subtarea (para forzar)
 *   onResolver       – (body) => Promise<subtareActualizada|null>
 *                      Recibe el body PATCH y devuelve updated o null (si hay nuevo conflicto)
 *   cargando         – boolean del hook padre
 *   errorExterno     – string | null
 */
function ConflictoModal({ open, onClose, conflictoData, currentFecha, onResolver, cargando, errorExterno }) {
  const [selectedDate, setSelectedDate] = useState(null)
  const [horasReducir, setHorasReducir] = useState('')
  const [errorLocal, setErrorLocal] = useState(null)

  if (!open || !conflictoData) return null

  const { mensaje, horas_planificadas, limite, max_horas_permitidas, puede_reducir, sugerencias = [] } = conflictoData

  const error = errorExterno || errorLocal

  const handleMover = async () => {
    if (!selectedDate) return
    setErrorLocal(null)
    const result = await onResolver({ fecha_objetivo: selectedDate })
    if (!result) {
      setErrorLocal('Ese día ya no tiene suficiente espacio. Elige otro.')
      setSelectedDate(null)
    }
  }

  const handleReducir = async () => {
    const horas = parseFloat(horasReducir)
    if (isNaN(horas) || horas < 0.5) return
    setErrorLocal(null)
    const result = await onResolver({ fecha_objetivo: currentFecha, horas_estimadas: horas })
    if (!result) {
      setErrorLocal(`Con ${horas}h aún excedes el límite. Prueba un valor menor.`)
    }
  }

  const handleForzar = async () => {
    setErrorLocal(null)
    await onResolver({ fecha_objetivo: currentFecha, forzar: true })
  }

  const puedeReducir = puede_reducir !== false && max_horas_permitidas > 0

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-4 border-b border-[#E1E4E7]">
          <div>
            <h2 className="text-base font-bold text-amber-700">⚠ Día con demasiadas horas</h2>
            <p className="text-sm text-gray-600 mt-1">{mensaje}</p>
            <p className="text-xs text-gray-400 mt-0.5">
              Planificadas: <span className="font-bold">{horas_planificadas}h</span>
              {' '}· Límite: <span className="font-bold">{limite}h</span>
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label="Cerrar modal de conflicto"
            className="text-gray-400 hover:text-gray-600 transition-colors shrink-0 ml-4">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {error && (
            <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          {/* Opción A: Mover a otro día */}
          {sugerencias.length > 0 && (
            <div className="border border-[#E1E4E7] rounded-xl p-4 space-y-3">
              <h3 className="text-sm font-bold text-gray-700">Mover a otro día</h3>
              <p className="text-xs text-gray-500">Elige un día con espacio disponible:</p>
              <div className="space-y-1">
                {sugerencias.map(s => (
                  <label key={s.fecha}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-gray-50 border border-transparent hover:border-[#E1E4E7] transition-colors">
                    <input
                      type="radio"
                      name="fecha_destino_conflicto"
                      value={s.fecha}
                      checked={selectedDate === s.fecha}
                      onChange={() => setSelectedDate(s.fecha)}
                      className="accent-brand"
                    />
                    <span className="text-sm font-medium text-gray-800">
                      {formatearFechaSugerencia(s.fecha)}
                    </span>
                    <span className="text-xs text-gray-400 ml-auto">
                      {s.horas_disponibles}h disponibles
                    </span>
                  </label>
                ))}
              </div>
              <button type="button" onClick={handleMover} disabled={!selectedDate || cargando}
                className="w-full py-2 bg-brand hover:bg-brand-hover text-white text-sm font-bold rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                {cargando ? <><Loader2 size={14} className="animate-spin" /> Moviendo...</> : 'Mover a este día'}
              </button>
            </div>
          )}

          {/* Opción B: Reducir horas */}
          <div className="border border-[#E1E4E7] rounded-xl p-4 space-y-3">
            <h3 className="text-sm font-bold text-gray-700">Reducir horas de esta subtarea</h3>
            {!puedeReducir ? (
              <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                El día ya tiene {horas_planificadas}h planificadas (límite {limite}h).
                No hay espacio disponible. Mueve la subtarea a otro día.
              </p>
            ) : (
              <>
                <p className="text-xs text-gray-500">
                  Máximo sin conflicto:{' '}
                  <span className="font-bold text-brand">{max_horas_permitidas}h</span>
                </p>
                <div className="flex gap-2 items-center">
                  <input
                    type="number" min="0.5" step="0.5" max={max_horas_permitidas}
                    value={horasReducir}
                    onChange={e => setHorasReducir(e.target.value)}
                    placeholder={String(max_horas_permitidas)}
                    aria-label="Nuevas horas estimadas"
                    className="w-24 px-3 py-2 text-sm border border-[#E1E4E7] rounded-lg focus:ring-2 focus:ring-brand outline-none text-center"
                  />
                  <span className="text-xs text-gray-400">horas</span>
                  <button type="button" onClick={handleReducir}
                    disabled={!horasReducir || parseFloat(horasReducir) < 0.5 || cargando}
                    className="flex-1 py-2 bg-brand hover:bg-brand-hover text-white text-xs font-bold rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-1">
                    {cargando ? <><Loader2 size={12} className="animate-spin" /> Aplicando...</> : 'Aplicar'}
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Opción C: Forzar */}
          <div className="border border-amber-200 bg-amber-50 rounded-xl p-4 space-y-2">
            <h3 className="text-sm font-bold text-amber-800">Guardar de todas formas</h3>
            <p className="text-xs text-amber-700">
              El día quedará con más horas de las que planificas normalmente.
            </p>
            <button type="button" onClick={handleForzar} disabled={cargando}
              className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {cargando ? <><Loader2 size={14} className="animate-spin" /> Guardando...</> : 'Aceptar sobrecarga y guardar'}
            </button>
          </div>

          {/* Cancelar */}
          <button type="button" onClick={onClose} disabled={cargando}
            className="w-full py-2 text-gray-500 hover:text-gray-700 text-sm font-semibold transition-colors">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConflictoModal
