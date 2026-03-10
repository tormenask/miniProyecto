import { useState } from 'react'
import { Plus, Hourglass, Loader2 } from 'lucide-react'
import SubtareaItem from './SubtareaItem'
import SubtareaForm from './SubtareaForm'
import Modal from './Modal'
import AlertaHoras from './AlertaHoras'
import ConfigLimiteHoras from './ConfigLimiteHoras'
import useLimiteHoras from '../hooks/useLimiteHoras'
import { detectarConflictos } from '../utils/horasUtils'

function SubtareaList({
  subtareas, onAgregar, onToggle, onEliminar, guardando = false,
  fechaEvento, fechaLimite, onEditarSub, onMoverANuevaActividad,
  todasActividades = [], actividadId = null, actividadData = null
}) {
  const [modalAbierto, setModalAbierto] = useState(false)
  const [modalConflicto, setModalConflicto] = useState(null)
  const [fechasEditadas, setFechasEditadas] = useState({})
  const [horasEditadas, setHorasEditadas] = useState({})
  const [subSeleccionada, setSubSeleccionada] = useState(null)
  const [fechaDestino, setFechaDestino] = useState('')
  const [moviendo, setMoviendo] = useState(false)
  const [errorMover, setErrorMover] = useState(null)
  const [mostrarAlerta, setMostrarAlerta] = useState(true)
  const { limite, setLimite } = useLimiteHoras()

  const totalHoras = subtareas.reduce((acc, s) => acc + parseFloat(s.horas_estimadas || 0), 0)
  const completadas = subtareas.filter((s) => s.completada).length
  const progreso = subtareas.length > 0 ? Math.round((completadas / subtareas.length) * 100) : 0
  const conflictos = detectarConflictos(todasActividades, subtareas, actividadId, limite)

  const subsConflicto = modalConflicto
    ? subtareas.filter(s => s.fecha_objetivo?.slice(0, 10) === modalConflicto.fecha)
    : []

  const handleAgregar = (sub) => {
    onAgregar(sub)
    setModalAbierto(false)
    setMostrarAlerta(true)
  }

  const handleGuardarReducir = () => {
    Object.entries(horasEditadas).forEach(([subId, nuevasHoras]) => {
      const sub = subtareas.find(s => String(s.id) === String(subId))
      if (sub && nuevasHoras && parseFloat(nuevasHoras) !== parseFloat(sub.horas_estimadas)) {
        onEditarSub && onEditarSub(sub, { horas_estimadas: parseFloat(nuevasHoras) })
      }
    })
    setHorasEditadas({})
    setModalConflicto(null)
    setMostrarAlerta(true)
  }

  const handleMoverSubtarea = async () => {
    if (!subSeleccionada || !fechaDestino) {
      setErrorMover('Selecciona una subtarea y una fecha destino.')
      return
    }
    setMoviendo(true)
    setErrorMover(null)
    const ok = await onMoverANuevaActividad(subSeleccionada, fechaDestino, actividadData)
    setMoviendo(false)
    if (ok) {
      setSubSeleccionada(null)
      setFechaDestino('')
      setModalConflicto(null)
      setMostrarAlerta(true)
    } else {
      setErrorMover('Ocurrió un error al mover la subtarea. Intenta de nuevo.')
    }
  }

  const soloFecha = (str) => {
    if (!str) return null
    const fecha = new Date(str)
    const y = fecha.getFullYear()
    const m = String(fecha.getMonth() + 1).padStart(2, '0')
    const d = String(fecha.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#E1E4E7] p-6 space-y-4">
      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-[#1A1A1A]">Subactividades</h2>
          {subtareas.length > 0 && (
            <p className="text-xs text-gray-400 mt-0.5">
              {completadas}/{subtareas.length} completadas · {totalHoras.toFixed(1)}h estimadas
            </p>
          )}
        </div>
        <button onClick={() => setModalAbierto(true)}
          className="flex items-center gap-2 bg-brand hover:bg-brand-hover text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors">
          <Plus size={16} /> Agregar
        </button>
      </div>

      {/* Config límite */}
      <ConfigLimiteHoras limite={limite} onChange={(v) => { setLimite(v); setMostrarAlerta(true) }} />

      {/* Alerta */}
      {mostrarAlerta && conflictos.length > 0 && (
        <AlertaHoras
          conflictos={conflictos}
          limite={limite}
          onMoverDia={(fecha) => {
            setModalConflicto({ fecha, tipo: 'mover' })
            setSubSeleccionada(null)
            setFechaDestino('')
            setErrorMover(null)
          }}
          onReducirHoras={(fecha) => {
            setModalConflicto({ fecha, tipo: 'reducir' })
            setHorasEditadas({})
          }}
          onCerrar={() => setMostrarAlerta(false)}
        />
      )}

      {/* Barra de progreso */}
      {subtareas.length > 0 && (
        <div>
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Progreso</span>
            <span className="font-bold text-success-text">{progreso}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div className="bg-success-text h-2 rounded-full transition-all duration-500"
              style={{ width: `${progreso}%` }} />
          </div>
        </div>
      )}

      {/* Lista */}
      {subtareas.length === 0 ? (
        <div className="text-center py-10 text-gray-400">
          <Hourglass size={32} className="mx-auto mb-3 opacity-40" />
          <p className="text-sm">No hay subactividades todavía.</p>
          <p className="text-xs mt-1">Divide tu trabajo en pasos más pequeños.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {subtareas.map((sub) => (
            <SubtareaItem key={sub.id ?? sub.nombre} sub={sub} onToggle={onToggle} onEliminar={onEliminar} />
          ))}
        </div>
      )}

      {/* Modal agregar */}
      <Modal open={modalAbierto} onClose={() => setModalAbierto(false)} title="Nueva subactividad">
        <SubtareaForm
          onAgregar={handleAgregar}
          onCancelar={() => setModalAbierto(false)}
          guardando={guardando}
          fechaEvento={fechaEvento}
          fechaLimite={fechaLimite}
        />
      </Modal>

      {/* Modal mover a nueva actividad */}
      <Modal
        open={!!modalConflicto && modalConflicto.tipo === 'mover'}
        onClose={() => { setModalConflicto(null); setSubSeleccionada(null); setFechaDestino(''); setErrorMover(null) }}
        title="📅 Mover subtarea a otro día"
      >
        <div className="space-y-4">
          <p className="text-xs text-gray-500">
            Selecciona la subtarea que quieres mover y el día destino. Se creará una nueva actividad en ese día con esa subtarea.
          </p>

          {/* Seleccionar subtarea */}
          <div className="space-y-2">
            <label className="text-xs text-gray-500 font-semibold block">Subtarea a mover</label>
            {subsConflicto.map((sub) => (
              <div
                key={sub.id}
                onClick={() => setSubSeleccionada(sub)}
                className={`p-3 border rounded-lg cursor-pointer transition-all ${subSeleccionada?.id === sub.id
                    ? 'border-brand bg-red-50'
                    : 'border-[#E1E4E7] hover:border-gray-300'
                  }`}
              >
                <p className="text-sm font-semibold text-[#1A1A1A]">{sub.nombre}</p>
                <p className="text-xs text-gray-400 mt-0.5">{sub.horas_estimadas}h · {sub.fecha_objetivo}</p>
              </div>
            ))}
          </div>

          {/* Fecha destino */}
          <div>
            <label className="text-xs text-gray-500 font-semibold block mb-1">Día destino</label>
            <input
              type="date"
              value={fechaDestino}
              min={new Date().toISOString().slice(0, 10)}
              onChange={(e) => setFechaDestino(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-[#E1E4E7] rounded-lg focus:ring-2 focus:ring-brand outline-none"
            />
            <p className="text-[10px] text-gray-400 mt-1">
              Se creará una nueva actividad "{actividadData?.titulo}" en ese día con la subtarea seleccionada.
            </p>
          </div>

          {errorMover && (
            <p className="text-xs text-red-500 font-medium">{errorMover}</p>
          )}

          <div className="flex gap-2 pt-1">
            <button
              onClick={() => { setModalConflicto(null); setSubSeleccionada(null); setFechaDestino(''); setErrorMover(null) }}
              className="flex-1 py-2 rounded-lg border border-[#E1E4E7] text-gray-500 text-sm font-bold hover:border-gray-400 transition-colors">
              Cancelar
            </button>
            <button
              onClick={handleMoverSubtarea}
              disabled={moviendo || !subSeleccionada || !fechaDestino}
              className="flex-1 bg-brand hover:bg-brand-hover text-white py-2 rounded-lg text-sm font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {moviendo ? <><Loader2 className="animate-spin" size={14} /> Moviendo...</> : 'Mover subtarea'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal reducir horas */}
      <Modal
        open={!!modalConflicto && modalConflicto.tipo === 'reducir'}
        onClose={() => { setModalConflicto(null); setHorasEditadas({}) }}
        title="⏱ Reducir horas estimadas"
      >
        <div className="space-y-3">
          <p className="text-xs text-gray-500">Reduce las horas de las subtareas en conflicto:</p>
          {subsConflicto.map((sub) => (
            <div key={sub.id ?? sub.nombre} className="p-3 border border-[#E1E4E7] rounded-lg space-y-2">
              <p className="text-sm font-semibold text-[#1A1A1A]">{sub.nombre}</p>
              <p className="text-xs text-gray-400">Horas actuales: {sub.horas_estimadas}h</p>
              <div>
                <label className="text-xs text-gray-500 font-semibold block mb-1">Nuevas horas</label>
                <input
                  type="number" min="0.5" step="0.5"
                  value={horasEditadas[sub.id] ?? sub.horas_estimadas}
                  onChange={(e) => setHorasEditadas(prev => ({ ...prev, [sub.id]: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-[#E1E4E7] rounded-lg focus:ring-2 focus:ring-brand outline-none"
                />
              </div>
            </div>
          ))}
          <div className="flex gap-2 pt-1">
            <button onClick={() => { setModalConflicto(null); setHorasEditadas({}) }}
              className="flex-1 py-2 rounded-lg border border-[#E1E4E7] text-gray-500 text-sm font-bold hover:border-gray-400 transition-colors">
              Cancelar
            </button>
            <button onClick={handleGuardarReducir}
              className="flex-1 bg-brand hover:bg-brand-hover text-white py-2 rounded-lg text-sm font-bold transition-colors">
              Guardar cambios
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default SubtareaList