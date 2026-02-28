import { useNavigate } from "react-router-dom"
import { LayoutList, Calendar, ChevronRight, Loader2, Clock, BookOpen, Plus } from "lucide-react"
import Navbar from "../components/Navbar"
import ErrorAlert from "../components/ErrorAlert"
import useActividades from "../hooks/useActividades"

function MisActividades() {
    const { actividades, cargando, error } = useActividades()
    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-5xl mx-auto px-6 py-10">

                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Mis Actividades</h1>
                        <p className="text-gray-500 mt-1">Organiza tus entregas y exámenes del semestre.</p>
                    </div>
                    <button
                        onClick={() => navigate("/CrearActividad")}
                        className="flex items-center justify-center gap-2 bg-black text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg active:scale-95"
                    >
                        <Plus size={20} /> Nueva Actividad
                    </button>
                </header>

                {cargando ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                        <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
                        <p className="text-gray-500 animate-pulse">Cargando tus actividades...</p>
                    </div>
                ) : error ? (
                    <ErrorAlert mensaje={error} />
                ) : actividades.length === 0 ? (
                    <div className="bg-white rounded-3xl p-16 text-center shadow-sm border border-gray-100">
                        <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <LayoutList className="text-blue-400" size={36} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">No tienes actividades</h3>
                        <p className="text-gray-500 mt-2 mb-8 max-w-sm mx-auto">
                            Tu agenda está libre. Haz clic en el botón para agregar tu primera tarea.
                        </p>
                        <button onClick={() => navigate("/CrearActividad")}
                            className="text-blue-600 font-bold hover:text-blue-700 transition-colors">
                            + Crear mi primera actividad
                        </button>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {actividades.map((act) => (
                            <div key={act.id} onClick={() => navigate(`/actividad/${act.id}`)}
                                className="group bg-white p-6 rounded-2xl shadow-sm border border-transparent hover:border-blue-200 hover:shadow-md transition-all cursor-pointer flex items-center justify-between">
                                <div className="flex items-center gap-6">
                                    <div className="bg-gray-50 p-4 rounded-2xl text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                        <Calendar size={28} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                                            {act.titulo}
                                        </h3>
                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-gray-500">
                                            <div className="flex items-center gap-1"><BookOpen size={14} />{act.curso}</div>
                                            <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider">
                                                {act.tipo}
                                            </span>
                                        </div>
                                        {act.fecha_limite && (
                                            <div className="flex items-center gap-2 mt-3 text-xs font-bold text-red-500 bg-red-50 w-fit px-2 py-1 rounded-md">
                                                <Clock size={12} />
                                                Entrega: {new Date(act.fecha_limite).toLocaleDateString("es-ES", {
                                                    weekday: "short", day: "numeric", month: "short"
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="hidden sm:block text-right">
                                        <p className="text-[10px] uppercase font-black text-gray-300 tracking-widest">Creado</p>
                                        <p className="text-xs text-gray-400">{new Date(act.fecha_creacion).toLocaleDateString()}</p>
                                    </div>
                                    <ChevronRight className="text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default MisActividades