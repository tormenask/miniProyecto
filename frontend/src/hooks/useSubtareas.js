import { useState } from "react"

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"

function useSubtareas(actividadId, inicial = []) {
    const [subtareas, setSubtareas] = useState(inicial)
    const [guardando, setGuardando] = useState(false)

    const token = localStorage.getItem("access_token")
    const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }

    const agregar = async (sub) => {
        if (!actividadId) { setSubtareas((prev) => [...prev, { ...sub, id: Date.now() }]); return }
        setGuardando(true)
        try {
            const res = await fetch(`${API_URL}/api/activities/${actividadId}/subtasks/`, {
                method: "POST", headers, body: JSON.stringify(sub)
            })
            if (!res.ok) throw new Error("Error al guardar subactividad")
            const nueva = await res.json()
            setSubtareas((prev) => [...prev, nueva])
        } finally {
            setGuardando(false)
        }
    }

    const eliminar = async (subId) => {
        setSubtareas((prev) => prev.filter((s) => s.id !== subId))
        if (!actividadId) return
        await fetch(`${API_URL}/api/activities/${actividadId}/subtasks/${subId}/`, { method: "DELETE", headers })
    }

    const toggle = async (sub) => {
        const updated = { ...sub, completada: !sub.completada }
        setSubtareas((prev) => prev.map((s) => (s.id === sub.id ? updated : s)))
        if (!actividadId) return
        await fetch(`${API_URL}/api/activities/${actividadId}/subtasks/${sub.id}/`, {
            method: "PATCH", headers, body: JSON.stringify({ completada: updated.completada })
        })
    }

    return { subtareas, setSubtareas, guardando, agregar, eliminar, toggle }
}

export default useSubtareas