import { useNavigate } from 'react-router-dom'
import { CalendarClock, PlusCircle, Sun } from 'lucide-react'
import Navbar from '../components/Navbar'

function Home() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-app-bg font-sans">
      <Navbar />

      <div className="px-8 py-12 text-center">
        <h1 className="text-3xl font-bold text-[#1A1A1A] mb-2">Sistema de Gestión de Tareas</h1>
        <p className="text-gray-500 mb-12">Organiza tus actividades y subactividades de manera eficiente</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">

          {/* Card Hoy */}
          <div className="bg-white rounded-xl p-8 shadow-sm border border-[#E1E4E7] text-left flex flex-col justify-between">
            <div>
              <Sun size={40} className="text-brand mb-4" />
              <h2 className="text-lg font-bold text-[#1A1A1A] mb-3">Hoy</h2>
              <p className="text-gray-500 mb-8">Realiza seguimiento de tus actividades de hoy</p>
            </div>
            <button onClick={() => navigate('/hoy')}
              className="bg-brand hover:bg-brand-hover text-white rounded-lg py-3 font-bold w-full transition-colors">
              Ir a Hoy
            </button>
          </div>

          {/* Card Mis Actividades */}
          <div className="bg-white rounded-xl p-8 shadow-sm border border-[#E1E4E7] text-left flex flex-col justify-between">
            <div>
              <CalendarClock size={40} className="text-brand mb-4" />
              <h2 className="text-lg font-bold text-[#1A1A1A] mb-3">Mis Actividades</h2>
              <p className="text-gray-500 mb-8">Ve tus prioridades urgentes organizadas por vencimiento</p>
            </div>
            <button onClick={() => navigate('/MisActividades')}
              className="bg-brand hover:bg-brand-hover text-white rounded-lg py-3 font-bold w-full transition-colors">
              Ir a Mis Actividades
            </button>
          </div>

          {/* Card Crear Actividad */}
          <div className="bg-white rounded-xl p-8 shadow-sm border border-[#E1E4E7] text-left flex flex-col justify-between">
            <div>
              <PlusCircle size={40} className="text-brand mb-4" />
              <h2 className="text-lg font-bold text-[#1A1A1A] mb-3">Crear Actividad</h2>
              <p className="text-gray-500 mb-8">Crea y organiza nuevas actividades y subactividades</p>
            </div>
            <button onClick={() => navigate('/CrearActividad')}
              className="bg-brand hover:bg-brand-hover text-white rounded-lg py-3 font-bold w-full transition-colors">
              Ir a Crear Actividad
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Home
