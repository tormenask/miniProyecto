import { CalendarDays } from "lucide-react"
import Navbar from "../components/Navbar"
import TodayView from "../components/hoy/TodayView"
import useHoy from "../hooks/useHoy"

function Hoy() {
  const { vencidas, hoy, proximas, loading, error, fetchTasks } = useHoy()

  const fecha = new Date().toLocaleDateString("es-ES", {
    weekday: "long", day: "numeric", month: "long"
  })
  const fechaCapitalizada = fecha.charAt(0).toUpperCase() + fecha.slice(1)

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-10">

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
            <span className="text-4xl font-black text-gray-100 leading-none select-none">
              {new Date().getDate()}
            </span>
            <span className="text-xs text-gray-400 uppercase tracking-widest">
              {new Date().toLocaleDateString("es-ES", { month: "long" })}
            </span>
          </div>
        </div>

        <TodayView
          loading={loading}
          error={error}
          vencidas={vencidas}
          hoy={hoy}
          proximas={proximas}
          retryFetch={fetchTasks}
        />
      </div>
    </div>
  )
}

export default Hoy