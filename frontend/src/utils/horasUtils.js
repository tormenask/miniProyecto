// Suma todas las horas de todas las actividades por día (global)
export function calcularHorasGlobalesPorDia(todasActividades, subtareasActuales, actividadIdActual) {
    const mapa = {}

    // Sumar horas de todas las otras actividades
    todasActividades.forEach((act) => {
        if (act.id === actividadIdActual) return // la actividad actual se maneja por separado
            ; (act.subactivities || []).forEach((sub) => {
                if (!sub.fecha_objetivo || !sub.horas_estimadas) return
                const fecha = sub.fecha_objetivo.slice(0, 10)
                mapa[fecha] = (mapa[fecha] || 0) + parseFloat(sub.horas_estimadas)
            })
    })

    // Sumar horas de las subtareas actuales (las que se están editando)
    subtareasActuales.forEach((sub) => {
        if (!sub.fecha_objetivo || !sub.horas_estimadas) return
        const fecha = sub.fecha_objetivo.slice(0, 10)
        mapa[fecha] = (mapa[fecha] || 0) + parseFloat(sub.horas_estimadas)
    })

    return mapa
}

export function detectarConflictos(todasActividades, subtareasActuales, actividadIdActual, limite) {
    const horasPorDia = calcularHorasGlobalesPorDia(todasActividades, subtareasActuales, actividadIdActual)

    // Solo mostrar conflictos en días donde la actividad actual tiene subtareas
    const fechasPropias = new Set(
        subtareasActuales
            .filter(s => s.fecha_objetivo)
            .map(s => s.fecha_objetivo.slice(0, 10))
    )

    return Object.entries(horasPorDia)
        .filter(([fecha, horas]) => horas > limite && fechasPropias.has(fecha))
        .map(([fecha, horas]) => ({ fecha, horas }))
}

/**
 * Indica si una actividad tiene alguna subtarea en un día con sobrecarga global.
 * Se usa para mostrar el icono de alerta en ActividadCard.
 */
export function actividadTieneConflicto(actividad, todasActividades, limite) {
    const mapa = {}
    todasActividades.forEach(act => {
        ;(act.subactivities || []).forEach(sub => {
            if (!sub.fecha_objetivo || !sub.horas_estimadas) return
            const fecha = sub.fecha_objetivo.slice(0, 10)
            mapa[fecha] = (mapa[fecha] || 0) + parseFloat(sub.horas_estimadas)
        })
    })

    return (actividad.subactivities || []).some(sub => {
        if (!sub.fecha_objetivo) return false
        return (mapa[sub.fecha_objetivo.slice(0, 10)] || 0) > limite
    })
}

export function sugerirDiasDisponibles(todasActividades, limite, diasABuscar = 7) {
    // Construir mapa de horas por día con todas las actividades
    const mapa = {}
    todasActividades.forEach(act => {
        ; (act.subactivities || act.subtareas || []).forEach(sub => {
            if (!sub.fecha_objetivo || !sub.horas_estimadas) return
            const fecha = sub.fecha_objetivo.slice(0, 10)
            mapa[fecha] = (mapa[fecha] || 0) + parseFloat(sub.horas_estimadas)
        })
    })

    // Buscar días próximos con espacio disponible
    const hoy = new Date()
    const dias = []
    for (let i = 1; i <= diasABuscar; i++) {
        const d = new Date(hoy)
        d.setDate(hoy.getDate() + i)
        // Usar getters locales para evitar desfase de zona horaria con toISOString()
        const fecha = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
        const horasUsadas = mapa[fecha] || 0
        const horasLibres = +(limite - horasUsadas).toFixed(1)
        if (horasLibres > 0) {
            dias.push({ fecha, horasUsadas, horasLibres })
        }
    }
    return dias
}