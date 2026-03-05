import { useEffect, useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { LayoutList, Calendar, ChevronRight, Loader2, AlertCircle, Clock, BookOpen, Plus, Search } from "lucide-react"
import FiltroActividades from "../components/FiltroActividades"

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"

const TIPO_LABEL = {
  exam: 'Examen', quiz: 'Quiz', workshop: 'Taller',
  project: 'Proyecto', presentation: 'Presentación', other: 'Otro',
}

function MisActividades() {
  const [actividades, setActividades] = useState([])
  const [cargando, setCargando]       = useState(true)
  const [error, setError]             = useState(null)
  const [filtros, setFiltros]         = useState({
    busqueda: '', tipo: 'all', estado: 'all', materia: 'all', orden: 'reciente'
  })
  const navigate = useNavigate()

  useEffect(() => {
    const obtenerActividades = async () => {
      try {
        const token = localStorage.getItem("access_token")
        if (!token) { setError("No hay una sesión activa."); setCargando(false); return }

        const response = await fetch(`${API_URL}/api/activities/`, {
          method: 'GET',
          headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" }
        })

        if (response.status === 401) {
          localStorage.removeItem("access_token")
          throw new Error("Sesión expirada. Inicia sesión de nuevo.")
        }
        if (!response.ok) throw new Error("Error al conectar con el servidor.")

        const data = await response.json()
        setActividades(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setCargando(false)
      }
    }
    obtenerActividades()
  }, [])

  // ── Filtrado + ordenado ─────────────────────────────────────────────────────
  const filtradas = useMemo(() => {
    let result = [...actividades]

    if (filtros.busqueda.trim()) {
      const q = filtros.busqueda.toLowerCase()
      result = result.filter(a =>
        a.titulo?.toLowerCase().includes(q) || a.curso?.toLowerCase().includes(q)
      )
    }

    if (filtros.tipo !== 'all')    result = result.filter(a => a.tipo === filtros.tipo)
    if (filtros.materia !== 'all') result = result.filter(a => (a.curso ?? a.course) === filtros.materia)

    // Filtro de estado: busca en subtareas si todas/alguna tienen ese estado
    if (filtros.estado !== 'all') {
      result = result.filter(a =>
        (a.subtareas ?? a.subtasks ?? []).some(s => (s.estado ?? s.status) === filtros.estado)
      )
    }

    result.sort((a, b) => {
      if (filtros.orden === 'reciente')    return new Date(b.fecha_creacion) - new Date(a.fecha_creacion)
      if (filtros.orden === 'antigua')     return new Date(a.fecha_creacion) - new Date(b.fecha_creacion)
      if (filtros.orden === 'limite_asc')  return new Date(a.fecha_limite ?? '9999') - new Date(b.fecha_limite ?? '9999')
      if (filtros.orden === 'limite_desc') return new Date(b.fecha_limite ?? '0000') - new Date(a.fecha_limite ?? '0000')
      return 0
    })

    return result
  }, [actividades, filtros])

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-4xl mx-auto px-5 py-8">

        {/* ── Cabecera ────────────────────────────────────────────────── */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mis Actividades</h1>
            <p className="text-sm text-gray-500 mt-0.5">Organiza tus entregas y exámenes del semestre.</p>
          </div>
          <button
            onClick={() => navigate("/CrearActividad")}
            className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600
              text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors
              shadow-sm shadow-red-100 shrink-0"
          >
            <Plus size={16} />
            Nueva Actividad
          </button>
        </header>

        {/* ── Panel de filtros ─────────────────────────────────────────── */}
        <FiltroActividades
          actividades={actividades}
          onChange={setFiltros}
          className="mb-5"
        />

        {/* ── Contador ────────────────────────────────────────────────── */}
        {!cargando && !error && (
          <p className="text-xs text-gray-400 mb-3 px-1">
            {filtradas.length === actividades.length
              ? `${actividades.length} actividad${actividades.length !== 1 ? 'es' : ''}`
              : `${filtradas.length} de ${actividades.length} actividades`
            }
          </p>
        )}

        {/* ── Estados ─────────────────────────────────────────────────── */}
        {cargando ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-200">
            <Loader2 className="animate-spin text-red-400 mb-3" size={32} />
            <p className="text-sm text-gray-400">Cargando tus actividades…</p>
          </div>

        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-600 px-5 py-4 rounded-2xl flex items-center gap-3 text-sm">
            <AlertCircle size={20} className="shrink-0" />
            <div>
              <p className="font-semibold">Hubo un problema</p>
              <p className="text-red-500 text-xs mt-0.5">{error}</p>
            </div>
          </div>

        ) : actividades.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 py-16 text-center">
            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <LayoutList className="text-gray-300" size={28} />
            </div>
            <p className="text-sm font-semibold text-gray-700">No tienes actividades aún</p>
            <p className="text-xs text-gray-400 mt-1 mb-5">Crea tu primera actividad para empezar a planificar.</p>
            <button
              onClick={() => navigate("/CrearActividad")}
              className="text-sm font-semibold text-red-500 hover:underline"
            >+ Crear mi primera actividad</button>
          </div>

        ) : filtradas.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 py-14 text-center">
            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="text-gray-300" size={24} />
            </div>
            <p className="text-sm font-semibold text-gray-700">Sin resultados</p>
            <p className="text-xs text-gray-400 mt-1">Ninguna actividad coincide con los filtros aplicados.</p>
          </div>

        ) : (
          <div className="flex flex-col gap-3">
            {filtradas.map(act => (
              <div
                key={act.id}
                onClick={() => navigate(`/actividad/${act.id}`)}
                className="group bg-white rounded-2xl border border-gray-200 px-5 py-4
                  hover:border-red-200 hover:shadow-sm transition-all cursor-pointer
                  flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-gray-50 group-hover:bg-red-50
                    flex items-center justify-center shrink-0 transition-colors">
                    <Calendar className="text-gray-300 group-hover:text-red-400 transition-colors" size={20} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-gray-800 group-hover:text-red-600 transition-colors truncate">
                      {act.titulo}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <BookOpen size={11} /> {act.curso}
                      </span>
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100
                        text-gray-500 border border-gray-200">
                        {TIPO_LABEL[act.tipo] ?? act.tipo}
                      </span>
                      {act.fecha_limite && (
                        <span className="flex items-center gap-1 text-xs font-medium text-red-500
                          bg-red-50 px-2 py-0.5 rounded-full border border-red-100">
                          <Clock size={10} />
                          {new Date(act.fecha_limite).toLocaleDateString('es-CO', {
                            day: 'numeric', month: 'short'
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <ChevronRight
                  className="text-gray-300 group-hover:text-red-400 group-hover:translate-x-0.5 transition-all shrink-0"
                  size={18}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MisActividades