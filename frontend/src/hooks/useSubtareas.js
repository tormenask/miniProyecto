import { useState } from "react"

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"

function useSubtareas(actividadId, inicial = []) {
    const [subtareas, setSubtareas] = useState(inicial)
    const [guardando, setGuardando] = useState(false)

    const token = localStorage.getItem("access_token")
    const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }

    const handle401 = (res) => {
        if (res.status === 401) {
            localStorage.removeItem('access_token')
            localStorage.removeItem('refresh_token')
            localStorage.setItem('session_expired', '1')
            window.location.href = '/login'
            return true
        }
        return false
    }

    const agregar = async (sub) => {
        if (!actividadId) { setSubtareas((prev) => [...prev, { ...sub, id: Date.now() }]); return }
        setGuardando(true)
        try {
            const res = await fetch(`${API_URL}/api/activities/${actividadId}/subtasks/`, {
                method: "POST", headers, body: JSON.stringify(sub)
            })
            if (handle401(res)) return
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
        const res = await fetch(`${API_URL}/api/activities/${actividadId}/subtasks/${subId}/`, { method: "DELETE", headers })
        if (res) handle401(res)
    }

    const toggle = async (sub) => {
        const updated = { ...sub, completada: !sub.completada }
        setSubtareas((prev) => prev.map((s) => (s.id === sub.id ? updated : s)))
        if (!actividadId) return
        const res = await fetch(`${API_URL}/api/activities/${actividadId}/subtasks/${sub.id}/`, {
            method: "PATCH", headers, body: JSON.stringify({ completada: updated.completada })
        })
        if (res) handle401(res)
    }

    const editar = async (sub, cambios, forzar = false) => {
        if (!actividadId) {
            setSubtareas((prev) => prev.map((s) => (s.id === sub.id ? { ...sub, ...cambios } : s)))
            return { ok: true }
        }
        const body = forzar ? { ...cambios, forzar: true } : cambios
        const res = await fetch(`${API_URL}/api/activities/${actividadId}/subtasks/${sub.id}/`, {
            method: "PATCH", headers, body: JSON.stringify(body)
        })
        if (handle401(res)) return { ok: false, conflicto: false }
        if (res.status === 409) {
            const data = await res.json()
            return { ok: false, conflicto: true, data }
        }
        if (!res.ok) return { ok: false, conflicto: false }
        const updated = await res.json()
        setSubtareas((prev) => prev.map((s) => (s.id === sub.id ? updated : s)))
        return { ok: true }
    }

    // Crea nueva actividad con los datos de la original y mueve la subtarea allí
    const moverANuevaActividad = async (sub, nuevaFecha, actividadData) => {
        if (!actividadId || !actividadData) return false
        setGuardando(true)
        try {
            // 1. Crear nueva actividad con fecha destino
            const nuevaActividad = {
                titulo: actividadData.titulo,
                tipo: actividadData.tipo,
                curso: actividadData.curso,
                descripcion: actividadData.descripcion || '',
                fecha_evento: `${nuevaFecha}T00:00:00`,
                fecha_limite: `${nuevaFecha}T23:59:00`,
            }
            const resActividad = await fetch(`${API_URL}/api/activities/`, {
                method: "POST", headers, body: JSON.stringify(nuevaActividad)
            })
            if (!resActividad.ok) throw new Error("Error al crear nueva actividad")
            const actividadCreada = await resActividad.json()

            // 2. Crear la subtarea en la nueva actividad
            const resSub = await fetch(`${API_URL}/api/activities/${actividadCreada.id}/subtasks/`, {
                method: "POST", headers,
                body: JSON.stringify({
                    nombre: sub.nombre,
                    fecha_objetivo: nuevaFecha,
                    horas_estimadas: sub.horas_estimadas,
                    completada: false,
                })
            })
            if (!resSub.ok) throw new Error("Error al mover subactividad")

            // 3. Eliminar la subtarea de la actividad original
            await fetch(`${API_URL}/api/activities/${actividadId}/subtasks/${sub.id}/`, {
                method: "DELETE", headers
            })
            setSubtareas((prev) => prev.filter((s) => s.id !== sub.id))

            return true
        } catch (err) {
            console.error(err)
            return false
        } finally {
            setGuardando(false)
        }
    }

    return { subtareas, setSubtareas, guardando, agregar, eliminar, toggle, editar, moverANuevaActividad }
}

export default useSubtareas