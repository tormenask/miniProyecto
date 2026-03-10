import { CalendarDays, AlertTriangle } from "lucide-react"
import Navbar from "../components/Navbar"
import TodayView from "../components/hoy/TodayView"
import ResumenHoras from "../components/hoy/ResumenHoras"
import ModalReorganizar from "../components/hoy/ModalReorganizar"
import useHoy from "../hooks/useHoy"
import useActividades from "../hooks/useActividades"
import useLimiteHoras from "../hooks/useLimiteHoras"
import useReorganizar from "../hooks/useReorganizar"

function Hoy() {
  const { vencidas, hoy, proximas, loading, error, fetchTasks } = useHoy()
  const { actividades } = useActividades()
  const { limite } = useLimiteHoras()

  const { modalAbierto, setModalAbierto, seleccion, setSeleccion, moviendo, errorMover,
    exitoMover, diasDisponibles, abrirModal, confirmar } = useReorganizar(hoy, actividades, limite, fetchTasks)

  const fecha = new Date().toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" })
  const fechaCapitalizada = fecha.charAt(0).toUpperCase() + fecha.slice(1)

  const horasTotalesHoy = hoy.flatMap(a => a.subactivities || [])
    .reduce((acc, s) => acc + parseFloat(s.horas_estimadas || 0), 0)
  const superaLimite = !loading && horasTotalesHoy > limite

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

        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <CalendarDays size={20} className="text-gray-400" />
              <p className="text-sm text-gray-400 font-medium">{fechaCapitalizada}</p>
            </div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Vista de Hoy</h1>
            <p className="text-sm text-gray-500 mt-1">Aquí están todas tus actividades organizadas por fecha límite.</p>
          </div>
          <div className="hidden md:flex flex-col items-end gap-1">
            <span className="text-4xl font-black text-gray-200 leading-none select-none">{new Date().getDate()}</span>
            <span className="text-xs text-gray-400 uppercase tracking-widest">
              {new Date().toLocaleDateString("es-ES", { month: "long" })}
            </span>
          </div>
        </div>

        {!loading && <ResumenHoras hoy={hoy} vencidas={vencidas} proximas={proximas} limite={limite} />}

        <TodayView loading={loading} error={error} vencidas={vencidas} hoy={hoy} proximas={proximas} retryFetch={fetchTasks} />
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