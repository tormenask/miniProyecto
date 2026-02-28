import { useEffect, useState } from "react"

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"

function useActividad(id) {
    const [actividad, setActividad] = useState(null)
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState(null)

    const token = localStorage.getItem("access_token")
    const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }

    useEffect(() => {
        if (!id) { setCargando(false); return }
        const cargar = async () => {
            try {
                const res = await fetch(`${API_URL}/api/activities/${id}/`, { headers })
                if (res.status === 401) { localStorage.removeItem("access_token"); throw new Error("Sesión expirada.") }
                if (!res.ok) throw new Error("No se pudo cargar la actividad.")
                setActividad(await res.json())
            } catch (err) {
                setError(err.message)
            } finally {
                setCargando(false)
            }
        }
        cargar()
    }, [id])

    return { actividad, cargando, error }
}

export default useActividad


