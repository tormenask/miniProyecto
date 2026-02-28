import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, Pencil, Trash2, Loader2, AlertCircle, Calendar, BookOpen, Clock } from "lucide-react"
import Navbar from "../components/Navbar"
import ErrorAlert from "../components/ErrorAlert"
import SubtareaList from "../components/SubtareaList"
import useActividad from "../hooks/useActividad"
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
    const { actividad, cargando, error } = useActividad(id)
    const { subtareas, setSubtareas, guardando, agregar, eliminar, toggle } = useSubtareas(id)
    const [eliminando, setEliminando] = useState(false)
    const [confirmarEliminar, setConfirmarEliminar] = useState(false)
    const [errorAccion, setErrorAccion] = useState(null)

    const token = localStorage.getItem("access_token")
    const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }

    // Cargar subtareas iniciales
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
            navigate("/MisActividades")
        } catch (err) {
            setErrorAccion(err.message)
            setEliminando(false)
        }
    }

    if (cargando) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="flex flex-col items-center justify-center py-32">
                    <Loader2 className="animate-spin text-blue-500 mb-4" size={40} />
                    <p className="text-gray-400 animate-pulse">Cargando actividad...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50">
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
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-3xl mx-auto px-6 py-10">

                <button onClick={() => navigate("/MisActividades")}
                    className="flex items-center text-gray-400 hover:text-black mb-6 transition-colors text-sm">
                    <ArrowLeft size={16} className="mr-2" />
                    Volver a mis actividades
                </button>

                <ErrorAlert mensaje={errorAccion} />

                {/* Card principal */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6">
                    <div className="flex items-start justify-between gap-4 mb-6">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <span className={`text-xs font-bold uppercase px-3 py-1 rounded-full tracking-wider ${TIPO_COLORS[actividad.tipo]}`}>
                                    {TIPO_LABELS[actividad.tipo]}
                                </span>
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900">{actividad.titulo}</h1>
                            <div className="flex items-center gap-2 mt-2 text-gray-500 text-sm">
                                <BookOpen size={14} />
                                <span>{actividad.curso}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                            <button onClick={() => navigate(`/actividad/${id}/editar`)}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:border-black hover:text-black transition-all text-sm font-semibold">
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
                                    <p className="text-[10px] uppercase font-black text-blue-400 tracking-widest">Fecha del evento</p>
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
                                        {new Date(actividad.fecha_limite + "T00:00:00").toLocaleDateString("es-ES", {
                                            weekday: "long", day: "numeric", month: "long"
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
                    guardando={guardando}
                />
            </div>
        </div>
    )
}

export default DetalleActividad
