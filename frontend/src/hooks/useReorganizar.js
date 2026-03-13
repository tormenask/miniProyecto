import { useState } from "react"
import { sugerirDiasDisponibles } from "../utils/horasUtils"

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"

export default function useReorganizar(hoy, actividades, limite, onExito) {
    const [modalAbierto, setModalAbierto] = useState(false)
    const [seleccion, setSeleccion] = useState({})
    const [moviendo, setMoviendo] = useState(false)
    const [errorMover, setErrorMover] = useState(null)
    const [exitoMover, setExitoMover] = useState(false)

    const diasDisponibles = sugerirDiasDisponibles(actividades, limite)

    const abrirModal = () => {
        const preSeleccion = {}
        const horasOcupadas = {}
        // hoy items are now subtareas directly (new backend format)
        const subsExceso = hoy
            .filter(s => s.estado !== 'hecha' && !s.completada)
            .sort((a, b) => parseFloat(b.horas_estimadas) - parseFloat(a.horas_estimadas))

        subsExceso.forEach(sub => {
            const horas = parseFloat(sub.horas_estimadas || 0)
            const diaIdeal = diasDisponibles.find(d => (d.horasLibres - (horasOcupadas[d.fecha] || 0)) >= horas)
            if (diaIdeal) {
                preSeleccion[sub.id] = diaIdeal.fecha
                horasOcupadas[diaIdeal.fecha] = (horasOcupadas[diaIdeal.fecha] || 0) + horas
            }
        })

        setSeleccion(preSeleccion)
        setErrorMover(null)
        setExitoMover(false)
        setModalAbierto(true)
    }

    const confirmar = async () => {
        const subsAMover = Object.entries(seleccion).filter(([, f]) => !!f)
        if (!subsAMover.length) { setErrorMover('Selecciona al menos una subtarea.'); return }

        setMoviendo(true)
        setErrorMover(null)
        const token = localStorage.getItem("access_token")
        const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }

        try {
            for (const [subId, nuevaFecha] of subsAMover) {
                // New format: activity data is nested in sub.activity
                const sub = hoy.find(s => String(s.id) === String(subId))
                if (!sub) continue
                const act = sub.activity

                const resAct = await fetch(`${API_URL}/api/activities/`, {
                    method: "POST", headers,
                    body: JSON.stringify({
                        titulo: act.titulo, tipo: act.tipo,
                        curso: act.curso, descripcion: act.descripcion || '',
                        fecha_evento: `${nuevaFecha}T00:00:00`, fecha_limite: `${nuevaFecha}T23:59:00`,
                    })
                })
                if (!resAct.ok) throw new Error(`Error al crear actividad para ${sub.nombre}`)
                const actCreada = await resAct.json()

                await fetch(`${API_URL}/api/activities/${actCreada.id}/subtasks/`, {
                    method: "POST", headers,
                    body: JSON.stringify({ nombre: sub.nombre, fecha_objetivo: nuevaFecha, horas_estimadas: sub.horas_estimadas })
                })
                await fetch(`${API_URL}/api/activities/${act.id}/subtasks/${subId}/`, { method: "DELETE", headers })
            }

            setExitoMover(true)
            setTimeout(() => { setModalAbierto(false); setExitoMover(false); onExito?.() }, 1500)
        } catch (err) {
            setErrorMover(err.message || 'Error al mover las subtareas.')
        } finally {
            setMoviendo(false)
        }
    }

    return {
        modalAbierto, setModalAbierto, seleccion, setSeleccion,
        moviendo, errorMover, exitoMover, diasDisponibles,
        abrirModal, confirmar
    }
}
