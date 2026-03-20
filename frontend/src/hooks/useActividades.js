import { useEffect, useState } from "react"
import { authFetch } from "../utils/auth"

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"

function useActividades() {
    const [actividades, setActividades] = useState([])
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const obtener = async () => {
            try {
                const res = await authFetch(`${API_URL}/api/activities/`)
                if (!res.ok) throw new Error("Error al conectar con el servidor.")
                const data = await res.json()
                setActividades(data.sort((a, b) => new Date(b.fecha_creacion) - new Date(a.fecha_creacion)))
            } catch (err) {
                setError(err.message)
            } finally {
                setCargando(false)
            }
        }
        obtener()
    }, [])

    return { actividades, cargando, error }
}

export default useActividades
