import Navbar from "../components/Navbar"
import TodayView from "../components/hoy/TodayView"
import useHoy from "../hooks/useHoy"

function Hoy() {
  const { vencidas, hoy, proximas, loading, error, fetchTasks } = useHoy()

  return (
    <div className="min-h-screen bg-app-bg">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Vista de Hoy</h1>
        <p className="text-sm text-gray-500 mb-8">
          {new Date().toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" })}
        </p>
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
