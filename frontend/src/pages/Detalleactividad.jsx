import { useEffect, useState } from "react"
import { useNavigate, useParams, useLocation } from "react-router-dom"
import { ArrowLeft, Pencil, Trash2, Loader2, AlertCircle, Calendar, BookOpen, Clock } from "lucide-react"
import Navbar from "../components/Navbar"
import Alert from "../components/Alert"
import SubtareaList from "../components/SubtareaList"
import Toast from "../components/Toast"
import useActividad from "../hooks/useActividad"
import useActividades from "../hooks/useActividades"
import useSubtareas from "../hooks/useSubtareas"

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"

const TIPO_LABELS = { exam: "Examen", quiz: "Quiz", workshop: "Taller", project: "Proyecto", other: "Otro" }
const TIPO_COLORS = {
  exam: "bg-red-100 text-red-700", quiz: "bg-yellow-100 text-yellow-700",
  workshop: "bg-blue-100 text-blue-700", project: "bg-purple-100 text-purple-700",
  other: "bg-gray-100 text-gray-600"
}

function DetalleActividad() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { actividad, cargando, error } = useActividad(id)
  const { actividades } = useActividades()
  const { subtareas, setSubtareas, guardando, agregar, eliminar, toggle, posponer, editar, moverANuevaActividad } = useSubtareas(id)
  const [eliminando, setEliminando] = useState(false)
  const [confirmarEliminar, setConfirmarEliminar] = useState(false)
  const [errorAccion, setErrorAccion] = useState(null)
  const [exito, setExito] = useState(location.state?.exito || null)

  const token = localStorage.getItem("access_token")
  const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }

  useEffect(() => {
    if (!id) return
    const cargarSubs = async () => {
      const res = await fetch(`${API_URL}/api/activities/${id}/subtasks/`, { headers })
      if (res.ok) setSubtareas(await res.json())
    }
    cargarSubs()
  }, [id])

  const handleEliminar = async () => {
    setEliminando(true)
    try {
      const res = await fetch(`${API_URL}/api/activities/${id}/`, { method: "DELETE", headers })
      if (!res.ok) throw new Error("Error al eliminar la actividad.")
      navigate("/MisActividades", { state: { exito: `Actividad eliminada con éxito.` } })
    } catch (err) {
      setErrorAccion(err.message)
      setEliminando(false)
    }
  }

  if (cargando) {
    return (
      <div className="min-h-screen bg-app-bg">
        <Navbar />
        <div className="max-w-3xl mx-auto px-6 py-10 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-44 mb-6" />
          <div className="bg-white rounded-2xl border border-[#E1E4E7] p-8 mb-6 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-3">
                <div className="flex gap-2">
                  <div className="h-6 w-20 bg-gray-200 rounded-full" />
                </div>
                <div className="h-7 bg-gray-200 rounded w-2/3" />
                <div className="h-4 bg-gray-100 rounded w-32" />
              </div>
              <div className="flex gap-2">
                <div className="h-9 w-24 bg-gray-100 rounded-lg" />
                <div className="h-9 w-24 bg-gray-100 rounded-lg" />
              </div>
            </div>
            <div className="h-16 bg-gray-100 rounded-xl" />
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="h-14 bg-gray-100 rounded-xl" />
              <div className="h-14 bg-gray-100 rounded-xl" />
            </div>
          </div>
          <div className="bg-white rounded-xl border border-[#E1E4E7] p-6 space-y-4">
            <div className="h-5 bg-gray-200 rounded w-36" />
            <div className="h-10 bg-gray-100 rounded-xl" />
            <div className="h-10 bg-gray-100 rounded-xl" />
            <div className="h-10 bg-gray-100 rounded-xl" />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-app-bg">
        <Navbar />
        <div className="max-w-2xl mx-auto px-6 py-10">
          <div className="bg-red-50 border border-red-100 text-red-600 px-6 py-5 rounded-2xl flex items-center gap-4">
            <AlertCircle size={24} />
            <p>{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-app-bg">
      <Toast mensaje={exito} duracion={2500} onClose={() => setExito(null)} />
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-10">

        <button onClick={() => navigate("/MisActividades")}
          className="flex items-center text-gray-400 hover:text-brand mb-6 transition-colors text-sm">
          <ArrowLeft size={16} className="mr-2" />
          Volver a mis actividades
        </button>

        <Alert mensaje={errorAccion} />

        <div className="bg-white rounded-2xl shadow-sm border border-[#E1E4E7] p-8 mb-6">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className={`text-xs font-bold uppercase px-3 py-1 rounded-full tracking-wider ${TIPO_COLORS[actividad.tipo]}`}>
                  {TIPO_LABELS[actividad.tipo]}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-[#1A1A1A]">{actividad.titulo}</h1>
              <div className="flex items-center gap-2 mt-2 text-gray-500 text-sm">
                <BookOpen size={14} />
                <span>{actividad.curso}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => navigate(`/actividad/${id}/editar`)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#E1E4E7] text-gray-600 hover:border-brand hover:text-brand transition-all text-sm font-semibold">
                <Pencil size={15} /> Editar
              </button>
              {!confirmarEliminar ? (
                <button onClick={() => setConfirmarEliminar(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-100 text-red-500 hover:bg-red-50 transition-all text-sm font-semibold">
                  <Trash2 size={15} /> Eliminar
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-red-600 font-semibold">¿Confirmar?</span>
                  <button onClick={handleEliminar} disabled={eliminando}
                    className="px-3 py-2 bg-red-500 text-white rounded-lg text-sm font-bold hover:bg-red-600 disabled:opacity-60 transition-colors">
                    {eliminando ? <Loader2 className="animate-spin" size={14} /> : "Sí, eliminar"}
                  </button>
                  <button onClick={() => setConfirmarEliminar(false)}
                    className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-bold hover:bg-gray-200 transition-colors">
                    Cancelar
                  </button>
                </div>
              )}
            </div>
          </div>

          {actividad.descripcion && (
            <p className="text-gray-600 text-sm leading-relaxed bg-gray-50 rounded-xl px-4 py-3 mb-6">
              {actividad.descripcion}
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {actividad.fecha_evento && (
              <div className="flex items-center gap-3 bg-blue-50 rounded-xl px-4 py-3">
                <Calendar size={18} className="text-blue-500 shrink-0" />
                <div>
                  <p className="text-[10px] uppercase font-black text-blue-400 tracking-widest">Fecha de inicio</p>
                  <p className="text-sm font-bold text-blue-800">
                    {new Date(actividad.fecha_evento).toLocaleString("es-ES", {
                      weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit"
                    })}
                  </p>
                </div>
              </div>
            )}
            {actividad.fecha_limite && (
              <div className="flex items-center gap-3 bg-red-50 rounded-xl px-4 py-3">
                <Clock size={18} className="text-red-500 shrink-0" />
                <div>
                  <p className="text-[10px] uppercase font-black text-red-400 tracking-widest">Fecha límite</p>
                  <p className="text-sm font-bold text-red-800">
                    {new Date(actividad.fecha_limite).toLocaleString("es-ES", {
                      weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit"
                    })}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <SubtareaList
          subtareas={subtareas}
          onAgregar={agregar}
          onToggle={toggle}
          onEliminar={eliminar}
          onPosponer={posponer}
          onEditarSub={editar}
          onMoverANuevaActividad={moverANuevaActividad}
          guardando={guardando}
          fechaEvento={actividad.fecha_evento}
          fechaLimite={actividad.fecha_limite}
          todasActividades={actividades}
          actividadId={parseInt(id)}
          actividadData={actividad}
        />
      </div>
    </div>
  )
}

export default DetalleActividad