import { useNavigate } from "react-router-dom"
import { CalendarClock, Calendar, ListChecks } from "lucide-react"
import Navbar from "../components/Navbar"

function Home() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <Navbar />

      <div className="px-8 py-12 text-center">
        <h1 className="text-3xl font-bold mb-2">Sistema de Gestión de Tareas</h1>
        <p className="text-gray-500 mb-12">Organiza tus actividades y subtareas de manera eficiente</p>

        <div className="grid grid-cols-3 gap-6 max-w-4xl mx-auto">

          <div className="bg-white rounded-xl p-8 shadow-sm text-left flex flex-col justify-between">
            <div>
              <CalendarClock size={40} className="text-blue-500 mb-4" />
              <h2 className="text-lg font-bold mb-3">Vista Mis Actividades</h2>
              <p className="text-gray-500 mb-8">Ve tus prioridades urgentes organizadas por vencimiento</p>
            </div>
            <button onClick={() => navigate("/MisActividades")}
              className="bg-black text-white rounded-lg py-3 font-bold w-full">
              Ir a Vista Mis Actividades
            </button>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-sm text-left flex flex-col justify-between">
            <div>
              <Calendar size={40} className="text-blue-500 mb-4" />
              <h2 className="text-lg font-bold mb-3">Crear Actividad</h2>
              <p className="text-gray-500 mb-8">Crea y organiza nuevas actividades y subtareas</p>
            </div>
            <button onClick={() => navigate("/CrearActividad")}
              className="bg-black text-white rounded-lg py-3 font-bold w-full">
              Ir a Crear Actividad
            </button>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-sm text-left flex flex-col justify-between opacity-50">
            <div>
              <ListChecks size={40} className="text-gray-400 mb-4" />
              <h2 className="text-lg font-bold mb-3">Todas las Tareas</h2>
              <p className="text-gray-500 mb-8">Gestiona todas tus actividades y subtareas</p>
            </div>
            <button className="border border-gray-200 text-gray-400 rounded-lg py-3 font-bold w-full cursor-not-allowed">
              Próximamente
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Home