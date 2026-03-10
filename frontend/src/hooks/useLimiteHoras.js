import { useState, useEffect } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
const DEFAULT = 6

function useLimiteHoras() {
    const [limite, setLimiteState] = useState(DEFAULT)
    const [cargando, setCargando] = useState(true)

    const token = localStorage.getItem('access_token')
    const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }

    useEffect(() => {
        fetch(`${API_URL}/api/users/profile/`, { headers })
            .then(res => res.ok ? res.json() : null)
            .then(data => {
                if (data?.limite_horas_diarias != null) {
                    setLimiteState(parseFloat(data.limite_horas_diarias))
                }
            })
            .catch(() => {})
            .finally(() => setCargando(false))
    }, [])

    const setLimite = async (valor) => {
        setLimiteState(valor)
        try {
            await fetch(`${API_URL}/api/users/profile/`, {
                method: 'PATCH',
                headers,
                body: JSON.stringify({ limite_horas_diarias: valor }),
            })
        } catch {}
    }

    return { limite, setLimite, cargando }
}

export default useLimiteHoras
