import { useState } from "react"
import { authFetch } from "../utils/auth"

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"

function useSubtareas(actividadId, inicial = []) {
    const [subtareas, setSubtareas] = useState(inicial)
    const [guardando, setGuardando] = useState(false)

    const agregar = async (sub) => {
        if (!actividadId) { setSubtareas((prev) => [...prev, { ...sub, id: Date.now(), estado: 'pendiente' }]); return }
        setGuardando(true)
        try {
            const res = await authFetch(`${API_URL}/api/activities/${actividadId}/subtasks/`, {
                method: "POST", body: JSON.stringify(sub)
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
        await authFetch(`${API_URL}/api/activities/${actividadId}/subtasks/${subId}/`, { method: "DELETE" })
    }

    // Toggle entre pendiente ↔ hecha
    const toggle = async (sub) => {
        const nuevoEstado = sub.estado === 'hecha' ? 'pendiente' : 'hecha'
        const updated = { ...sub, estado: nuevoEstado, nota_posposicion: nuevoEstado === 'pendiente' ? null : sub.nota_posposicion }
        setSubtareas((prev) => prev.map((s) => (s.id === sub.id ? updated : s)))
        if (!actividadId) return
        await authFetch(`${API_URL}/api/activities/${actividadId}/subtasks/${sub.id}/`, {
            method: "PATCH", body: JSON.stringify({ estado: nuevoEstado })
        })
    }

    // Marcar como pospuesta con nota opcional
    const posponer = async (sub, nota = '') => {
        const updated = { ...sub, estado: 'pospuesta', nota_posposicion: nota || null }
        setSubtareas((prev) => prev.map((s) => (s.id === sub.id ? updated : s)))
        if (!actividadId) return
        await authFetch(`${API_URL}/api/activities/${actividadId}/subtasks/${sub.id}/`, {
            method: "PATCH",
            body: JSON.stringify({ estado: 'pospuesta', nota_posposicion: nota || null })
        })
    }

    const editar = async (sub, cambios, forzar = false) => {
        if (!actividadId) {
            setSubtareas((prev) => prev.map((s) => (s.id === sub.id ? { ...sub, ...cambios } : s)))
            return { ok: true }
        }
        const body = forzar ? { ...cambios, forzar: true } : cambios
        const res = await authFetch(`${API_URL}/api/activities/${actividadId}/subtasks/${sub.id}/`, {
            method: "PATCH", body: JSON.stringify(body)
        })
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
                fecha_evento: new Date(`${nuevaFecha}T00:00:00`).toISOString(),
                fecha_limite: new Date(`${nuevaFecha}T23:59:00`).toISOString(),
            }
            const resActividad = await authFetch(`${API_URL}/api/activities/`, {
                method: "POST", body: JSON.stringify(nuevaActividad)
            })
            if (!resActividad.ok) throw new Error("Error al crear nueva actividad")
            const actividadCreada = await resActividad.json()

            // 2. Crear la subtarea en la nueva actividad
            const resSub = await authFetch(`${API_URL}/api/activities/${actividadCreada.id}/subtasks/`, {
                method: "POST",
                body: JSON.stringify({
                    nombre: sub.nombre,
                    fecha_objetivo: nuevaFecha,
                    horas_estimadas: sub.horas_estimadas,
                })
            })
            if (!resSub.ok) throw new Error("Error al mover subactividad")

            // 3. Eliminar la subtarea de la actividad original
            await authFetch(`${API_URL}/api/activities/${actividadId}/subtasks/${sub.id}/`, { method: "DELETE" })
            setSubtareas((prev) => prev.filter((s) => s.id !== sub.id))

            return true
        } catch (err) {
            console.error(err)
            return false
        } finally {
            setGuardando(false)
        }
    }

    return { subtareas, setSubtareas, guardando, agregar, eliminar, toggle, posponer, editar, moverANuevaActividad }
}

export default useSubtareas
