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
        const subsExceso = hoy.flatMap(a => a.subactivities || []).filter(s => !s.completada)
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
                const actividadPadre = hoy.find(a => a.subactivities?.some(s => String(s.id) === String(subId)))
                const sub = actividadPadre?.subactivities?.find(s => String(s.id) === String(subId))
                if (!actividadPadre || !sub) continue

                const resAct = await fetch(`${API_URL}/api/activities/`, {
                    method: "POST", headers,
                    body: JSON.stringify({
                        titulo: actividadPadre.titulo, tipo: actividadPadre.tipo,
                        curso: actividadPadre.curso, descripcion: actividadPadre.descripcion || '',
                        fecha_evento: `${nuevaFecha}T00:00:00`, fecha_limite: `${nuevaFecha}T23:59:00`,
                    })
                })
                if (!resAct.ok) throw new Error(`Error al crear actividad para ${sub.nombre}`)
                const actCreada = await resAct.json()

                await fetch(`${API_URL}/api/activities/${actCreada.id}/subtasks/`, {
                    method: "POST", headers,
                    body: JSON.stringify({ nombre: sub.nombre, fecha_objetivo: nuevaFecha, horas_estimadas: sub.horas_estimadas, completada: false })
                })
                await fetch(`${API_URL}/api/activities/${actividadPadre.id}/subtasks/${subId}/`, { method: "DELETE", headers })
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