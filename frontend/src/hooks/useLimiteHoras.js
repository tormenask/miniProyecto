import { useState, useEffect } from 'react'
import useProfile, { invalidateProfileCache } from './useProfile'

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
const DEFAULT = 6

function useLimiteHoras() {
    const perfil = useProfile()
    const [limite, setLimiteState] = useState(DEFAULT)
    const [cargando, setCargando] = useState(true)

    useEffect(() => {
        if (perfil === null && !localStorage.getItem('access_token')) {
            setCargando(false)
            return
        }
        if (perfil != null) {
            if (perfil.limite_horas_diarias != null) {
                setLimiteState(parseFloat(perfil.limite_horas_diarias))
            }
            setCargando(false)
        }
    }, [perfil])

    const setLimite = async (valor) => {
        setLimiteState(valor)
        const token = localStorage.getItem('access_token')
        try {
            await fetch(`${API_URL}/api/users/profile/`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ limite_horas_diarias: valor }),
            })
            invalidateProfileCache()
        } catch {}
    }

    return { limite, setLimite, cargando }
}

export default useLimiteHoras
