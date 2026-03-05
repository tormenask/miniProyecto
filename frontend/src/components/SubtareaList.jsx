// Lista de subtareas con barra de progreso y modal para agregar.
// UX #3 Control: modal con Escape para cerrar. Botón brand primario.
import { useState } from 'react'
import { Plus, Hourglass } from 'lucide-react'
import SubtareaItem from './SubtareaItem'
import SubtareaForm from './SubtareaForm'
import Modal from './Modal'

function SubtareaList({ subtareas, onAgregar, onToggle, onEliminar, guardando = false }) {
  const [modalAbierto, setModalAbierto] = useState(false)

  const totalHoras = subtareas.reduce((acc, s) => acc + parseFloat(s.horas_estimadas || 0), 0)
  const completadas = subtareas.filter((s) => s.completada).length
  const progreso = subtareas.length > 0 ? Math.round((completadas / subtareas.length) * 100) : 0

  const handleAgregar = (sub) => {
    onAgregar(sub)
    setModalAbierto(false)
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#E1E4E7] p-6">
      {/* Encabezado */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-base font-bold text-[#1A1A1A]">Subactividades</h2>
          {subtareas.length > 0 && (
            <p className="text-xs text-gray-400 mt-0.5">
              {completadas}/{subtareas.length} completadas · {totalHoras.toFixed(1)}h estimadas
            </p>
          )}
        </div>
        {/* UX #1 Visibilidad: botón primario brand */}
        <button
          onClick={() => setModalAbierto(true)}
          className="flex items-center gap-2 bg-brand hover:bg-brand-hover text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors"
        >
          <Plus size={16} /> Agregar
        </button>
      </div>

      {/* Barra de progreso en success color */}
      {subtareas.length > 0 && (
        <div className="mb-5">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Progreso</span>
            <span className="font-bold text-success-text">{progreso}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div
              className="bg-success-text h-2 rounded-full transition-all duration-500"
              style={{ width: `${progreso}%` }}
            />
          </div>
        </div>
      )}

      {/* Lista o estado vacío */}
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

      {/* Modal para agregar subtarea */}
      <Modal open={modalAbierto} onClose={() => setModalAbierto(false)} title="Nueva subactividad">
        <SubtareaForm
          onAgregar={handleAgregar}
          onCancelar={() => setModalAbierto(false)}
          guardando={guardando}
        />
      </Modal>
    </div>
  )
}

export default SubtareaList
