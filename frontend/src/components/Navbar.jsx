import { useNavigate } from "react-router-dom"
import { Home as HomeIcon, CalendarClock } from "lucide-react"

function Navbar() {
    const navigate = useNavigate()

    return (
        <nav className="bg-white px-8 py-3 flex items-center justify-between border-b border-gray-200">
            <div
                className="font-bold text-base flex items-center gap-2 cursor-pointer"
                onClick={() => navigate("/")}
            >
                <CalendarClock size={20} /> Gestión de Tareas
            </div>
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate("/")}
                    className="bg-black text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2"
                >
                    <HomeIcon size={16} /> Inicio
                </button>
                <button
                    onClick={() => navigate("/hoy")}
                    className="font-bold flex items-center gap-2"
                >
                    <CalendarClock size={16} /> Vista Hoy
                </button>
            </div>
        </nav>
    )
}

export default Navbar