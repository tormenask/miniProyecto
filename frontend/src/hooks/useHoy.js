import { useState, useEffect } from "react"

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"

function useHoy() {
    const [tasks, setTasks] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    const fetchTasks = async () => {
        setLoading(true)
        setError(false)
        try {
            const token = localStorage.getItem("access_token")
            const res = await fetch(`${API_URL}/api/activities/`, {
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
            })
            if (!res.ok) throw new Error()
            const data = await res.json()
            setTasks(data.filter((a) => a.fecha_limite))
        } catch {
            setError(true)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchTasks() }, [])

    return { tasks, loading, error, fetchTasks }
}

export default useHoy