import { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, AlertCircle, Calendar, BookOpen, Clock } from "lucide-react"
import Navbar from "../components/Navbar"
import SubtareaList from "../components/SubtareaList"
import useActividad from "../hooks/useActividad"
import useActividades from "../hooks/useActividades"
import useSubtareas from "../hooks/useSubtareas"

const TIPO_LABELS = { exam: "Examen", quiz: "Quiz", workshop: "Taller", project: "Proyecto", other: "Otro" }
const TIPO_COLORS = {
    exam: "bg-red-100 text-red-700", quiz: "bg-yellow-100 text-yellow-700",
    workshop: "bg-blue-100 text-blue-700", project: "bg-purple-100 text-purple-700",
    other: "bg-gray-100 text-gray-600"
}

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"

function HoyActividad() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { actividad, cargando, error } = useActividad(id)
    const { actividades } = useActividades()
    const { subtareas, setSubtareas, guardando, agregar, eliminar, toggle, posponer, editar, moverANuevaActividad } = useSubtareas(id)

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

    if (cargando) {
        return (
            <div className="min-h-screen bg-app-bg">
                <Navbar />
                <div className="max-w-3xl mx-auto px-6 py-10 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-36 mb-6" />
                    <div className="bg-white rounded-2xl border border-[#E1E4E7] p-8 mb-6 space-y-4">
                        <div className="flex items-start gap-4">
                            <div className="flex-1 space-y-3">
                                <div className="h-6 w-20 bg-gray-200 rounded-full" />
                                <div className="h-7 bg-gray-200 rounded w-2/3" />
                                <div className="h-4 bg-gray-100 rounded w-32" />
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

    const completadas = subtareas.filter(s => s.estado === 'hecha' || s.completada).length
    const progreso = subtareas.length > 0 ? Math.round((completadas / subtareas.length) * 100) : 0

    return (
        <div className="min-h-screen bg-app-bg">
            <Navbar />
            <div className="max-w-3xl mx-auto px-6 py-10">

                <button onClick={() => navigate("/hoy")}
                    className="flex items-center text-gray-400 hover:text-brand mb-6 transition-colors text-sm">
                    <ArrowLeft size={16} className="mr-2" />
                    Volver a Vista de Hoy
                </button>

                {/* Info de la actividad */}
                <div className="bg-white rounded-2xl shadow-sm border border-[#E1E4E7] p-6 mb-6">
                    <div className="flex items-start gap-4">
                        <div className="flex-1">
                            <span className={`text-xs font-bold uppercase px-3 py-1 rounded-full tracking-wider ${TIPO_COLORS[actividad.tipo]}`}>
                                {TIPO_LABELS[actividad.tipo]}
                            </span>
                            <h1 className="text-xl font-bold text-[#1A1A1A] mt-3">{actividad.titulo}</h1>
                            <div className="flex items-center gap-2 mt-1 text-gray-400 text-sm">
                                <BookOpen size={13} />
                                <span>{actividad.curso}</span>
                            </div>
                        </div>

                        {/* Progreso circular simple */}
                        <div className="flex flex-col items-center bg-gray-50 rounded-xl px-4 py-3 shrink-0">
                            <span className="text-2xl font-black text-brand">{progreso}%</span>
                            <span className="text-xs text-gray-400 mt-0.5">{completadas}/{subtareas.length} listas</span>
                        </div>
                    </div>

                    {actividad.descripcion && (
                        <p className="text-gray-500 text-sm leading-relaxed bg-gray-50 rounded-xl px-4 py-3 mt-4">
                            {actividad.descripcion}
                        </p>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                        {actividad.fecha_evento && (
                            <div className="flex items-center gap-3 bg-blue-50 rounded-xl px-4 py-3">
                                <Calendar size={16} className="text-blue-400 shrink-0" />
                                <div>
                                    <p className="text-[10px] uppercase font-black text-blue-400 tracking-widest">Fecha de inicio</p>
                                    <p className="text-xs font-bold text-blue-700">
                                        {new Date(actividad.fecha_evento).toLocaleString("es-ES", {
                                            weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit"
                                        })}
                                    </p>
                                </div>
                            </div>
                        )}
                        {actividad.fecha_limite && (
                            <div className="flex items-center gap-3 bg-red-50 rounded-xl px-4 py-3">
                                <Clock size={16} className="text-red-400 shrink-0" />
                                <div>
                                    <p className="text-[10px] uppercase font-black text-red-400 tracking-widest">Fecha límite</p>
                                    <p className="text-xs font-bold text-red-700">
                                        {new Date(actividad.fecha_limite).toLocaleString("es-ES", {
                                            weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit"
                                        })}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Subtareas */}
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

export default HoyActividad