import { useState } from 'react'

const CLAVE = 'limite_horas_diarias'
const DEFAULT = 6

function useLimiteHoras() {
    const [limite, setLimiteState] = useState(() => {
        const guardado = localStorage.getItem(CLAVE)
        return guardado ? parseFloat(guardado) : DEFAULT
    })

    const setLimite = (valor) => {
        localStorage.setItem(CLAVE, valor)
        setLimiteState(valor)
    }

    return { limite, setLimite }
}

export default useLimiteHoras