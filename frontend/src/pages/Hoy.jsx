import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { CalendarDays, AlertTriangle, X } from "lucide-react"
import Navbar from "../components/Navbar"
import TaskSkeleton from "../components/hoy/TaskSkeleton"
import EmptyTasks from "../components/hoy/EmptyTasks"
import ErrorState from "../components/hoy/ErrorState"
import SortRules from "../components/hoy/SortRules"
import Section from "../components/hoy/Section"
import ResumenHoras from "../components/hoy/ResumenHoras"
import ModalReorganizar from "../components/hoy/ModalReorganizar"
import useHoy from "../hooks/useHoy"
import useActividades from "../hooks/useActividades"
import useLimiteHoras from "../hooks/useLimiteHoras"
import useReorganizar from "../hooks/useReorganizar"

const ESTADOS = [
  { value: '', label: 'Todos los estados' },
  { value: 'pendiente', label: 'Pendiente' },
  { value: 'pospuesta', label: 'Pospuesta' },
]

function Hoy() {
  const navigate = useNavigate()
  const [filtroCurso, setFiltroCurso] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('')

  const { vencidas, hoy, proximas, summary, loading, error, fetchTasks } = useHoy({ curso: filtroCurso, estado: filtroEstado })
  const { actividades } = useActividades()
  const { limite } = useLimiteHoras()

  const { modalAbierto, setModalAbierto, seleccion, setSeleccion, moviendo, errorMover,
    exitoMover, diasDisponibles, abrirModal, confirmar } = useReorganizar(hoy, actividades, limite, fetchTasks)

  const fecha = new Date().toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" })
  const fechaCapitalizada = fecha.charAt(0).toUpperCase() + fecha.slice(1)

  // Items are now subtareas directly (new backend format)
  const horasTotalesHoy = summary?.horas_planificadas_hoy
    ?? hoy.reduce((acc, s) => acc + parseFloat(s.horas_estimadas || 0), 0)
  const superaLimite = !loading && horasTotalesHoy > limite

  // Derive unique course list from all activities
  const cursos = [...new Set(actividades.map(a => a.curso).filter(Boolean))].sort()

  const hayFiltros = filtroCurso || filtroEstado
  const limpiarFiltros = () => { setFiltroCurso(''); setFiltroEstado('') }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-10">

        {superaLimite && (
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 mb-6">
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
              <AlertTriangle size={15} className="text-amber-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-amber-700">Límite diario superado</p>
              <p className="text-xs text-amber-500 mt-0.5">
                Tienes <span className="font-bold">{horasTotalesHoy}h</span> planeadas,{" "}
                <span className="font-bold">{+(horasTotalesHoy - limite).toFixed(1)}h</span> sobre tu límite de{" "}
                <span className="font-bold">{limite}h</span>.
              </p>
            </div>
            <button onClick={abrirModal} disabled={diasDisponibles.length === 0}
              className="shrink-0 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors">
              {diasDisponibles.length === 0 ? 'Sin días disponibles' : 'Reorganizar'}
            </button>
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <CalendarDays size={20} className="text-gray-600" />
              <p className="text-sm text-gray-600 font-medium">{fechaCapitalizada}</p>
            </div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Vista de Hoy</h1>
            <p className="text-sm text-gray-600 mt-1">Aquí están todas tus actividades organizadas por fecha límite.</p>
          </div>
          <div className="hidden md:flex flex-col items-end gap-1">
            <span className="text-4xl font-black text-gray-900 leading-none select-none">{new Date().getDate()}</span>
            <span className="text-xs text-gray-900 uppercase tracking-widest">
              {new Date().toLocaleDateString("es-ES", { month: "long" })}
            </span>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <select
            value={filtroCurso}
            onChange={e => setFiltroCurso(e.target.value)}
            className="text-sm border border-[#E1E4E7] rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand"
            aria-label="Filtrar por curso"
          >
            <option value="">Todos los cursos</option>
            {cursos.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select
            value={filtroEstado}
            onChange={e => setFiltroEstado(e.target.value)}
            className="text-sm border border-[#E1E4E7] rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand"
            aria-label="Filtrar por estado"
          >
            {ESTADOS.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
          </select>
          {hayFiltros && (
            <button type="button" onClick={limpiarFiltros}
              className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-700 border border-[#E1E4E7] px-3 py-2 rounded-lg bg-white transition-colors">
              <X size={12} /> Limpiar filtros
            </button>
          )}
        </div>

        {!loading && <ResumenHoras hoy={hoy} vencidas={vencidas} proximas={proximas} limite={limite} />}

        {loading && <TaskSkeleton />}
        {!loading && error && <ErrorState onReintentar={fetchTasks} />}
        {!loading && !error && vencidas.length === 0 && hoy.length === 0 && proximas.length === 0 && (
          <EmptyTasks onCrear={() => navigate("/CrearActividad")} />
        )}
        {!loading && !error && (vencidas.length > 0 || hoy.length > 0 || proximas.length > 0) && (
          <div>
            <SortRules />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start mt-4">
              <Section variante="vencidas" items={vencidas} onRefresh={fetchTasks} />
              <Section variante="hoy" items={hoy} onRefresh={fetchTasks} />
              <Section variante="proximas" items={proximas} onRefresh={fetchTasks} />
            </div>
          </div>
        )}
      </div>

      <ModalReorganizar
        open={modalAbierto}
        onClose={() => setModalAbierto(false)}
        hoy={hoy}
        diasDisponibles={diasDisponibles}
        seleccion={seleccion}
        setSeleccion={setSeleccion}
        moviendo={moviendo}
        errorMover={errorMover}
        exitoMover={exitoMover}
        onConfirmar={confirmar}
      />
    </div>
  )
}

export default Hoy
