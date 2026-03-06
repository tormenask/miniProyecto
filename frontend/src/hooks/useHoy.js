import { useState, useEffect, useRef, useCallback } from 'react'
import { refreshAccessToken } from '../utils/auth'

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

function useHoy() {
  const [vencidas, setVencidas] = useState([])
  const [hoy, setHoy] = useState([])
  const [proximas, setProximas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const wsRef = useRef(null)

  const applyData = (data) => {
    setVencidas(data.vencidas || [])
    setHoy(data.hoy || [])
    setProximas(data.proximas || [])
    setLoading(false)
    setError(false)
  }

  const fetchRest = useCallback(async () => {
    setLoading(true)
    setError(false)
    try {
      const token = localStorage.getItem('access_token')
      const res = await fetch(`${API_URL}/api/activities/today/`, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      })
      if (!res.ok) throw new Error()
      applyData(await res.json())
    } catch {
      setError(true)
      setLoading(false)
    }
  }, [])

  const connectWs = useCallback(() => {
    const token = localStorage.getItem('access_token')
    if (!token) return

    const wsBase = API_URL.replace(/^http/, 'ws')
    const ws = new WebSocket(`${wsBase}/ws/activities/today/?token=${token}`)
    wsRef.current = ws

    ws.onmessage = (event) => {
      try {
        applyData(JSON.parse(event.data))
      } catch { /* ignore malformed frames */ }
    }

    ws.onerror = () => {
      // WebSocket no disponible, usar REST como fallback
      fetchRest()
    }

    ws.onclose = async (event) => {
      if (event.code === 4001) {
        // Token inválido o expirado — intentar renovar y reconectar
        try {
          await refreshAccessToken()
          connectWs()
        } catch {
          localStorage.setItem('session_expired', '1')
          window.location.href = '/login'
        }
      }
    }
  }, [fetchRest])

  useEffect(() => {
    connectWs()
    return () => {
      if (wsRef.current) wsRef.current.close()
    }
  }, [connectWs])

  const fetchTasks = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      // El WS mantiene datos al día; para refresh manual, usar REST
    }
    fetchRest()
  }

  return { vencidas, hoy, proximas, loading, error, fetchTasks }
}

export default useHoy
