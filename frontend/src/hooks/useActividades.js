import { useEffect, useState } from "react"

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"

function useActividades() {
    const [actividades, setActividades] = useState([])
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const obtener = async () => {
            try {
                const token = localStorage.getItem("access_token")
                if (!token) { setError("No hay sesión activa. Inicia sesión."); return }

                const res = await fetch(`${API_URL}/api/activities/`, {
                    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
                })

                if (res.status === 401) {
                    localStorage.removeItem("access_token")
                    throw new Error("Sesión expirada. Inicia sesión de nuevo.")
                }
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