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
    return Object.entries(horasPorDia)
        .filter(([, horas]) => horas > limite)
        .map(([fecha, horas]) => ({ fecha, horas }))
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
        const fecha = d.toISOString().slice(0, 10)
        const horasUsadas = mapa[fecha] || 0
        const horasLibres = +(limite - horasUsadas).toFixed(1)
        if (horasLibres > 0) {
            dias.push({ fecha, horasUsadas, horasLibres })
        }
    }
    return dias
}