import { useState, useEffect, useRef, useCallback } from 'react'
import { refreshAccessToken } from '../utils/auth'

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

function useHoy({ curso = '', estado = '' } = {}) {
  const [vencidas, setVencidas] = useState([])
  const [hoy, setHoy] = useState([])
  const [proximas, setProximas] = useState([])
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const wsRef = useRef(null)

  const applyData = (data) => {
    // Backend now returns overdue/today/upcoming (subtareas) — map to old names
    setVencidas(data.overdue || data.vencidas || [])
    setHoy(data.today || data.hoy || [])
    setProximas(data.upcoming || data.proximas || [])
    setSummary(data.summary || null)
    setLoading(false)
    setError(false)
  }

  const buildUrl = useCallback(() => {
    const params = new URLSearchParams()
    if (curso) params.set('curso', curso)
    if (estado) params.set('estado', estado)
    const qs = params.toString()
    return `${API_URL}/api/activities/today/${qs ? '?' + qs : ''}`
  }, [curso, estado])

  const fetchRest = useCallback(async () => {
    setLoading(true)
    setError(false)
    try {
      const token = localStorage.getItem('access_token')
      const res = await fetch(buildUrl(), {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      })
      if (!res.ok) throw new Error()
      applyData(await res.json())
    } catch {
      setError(true)
      setLoading(false)
    }
  }, [buildUrl])

  const connectWs = useCallback(() => {
    const token = localStorage.getItem('access_token')
    if (!token) return

    const wsBase = API_URL.replace(/^http/, 'ws')
    const ws = new WebSocket(`${wsBase}/ws/activities/today/?token=${token}`)
    wsRef.current = ws

    ws.onmessage = () => {
      // WebSocket pushes unfiltered data; re-fetch REST with current filters
      fetchRest()
    }

    ws.onerror = () => {
      fetchRest()
    }

    ws.onclose = async (event) => {
      if (event.code === 4001) {
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
    fetchRest()
  }, [fetchRest])

  useEffect(() => {
    connectWs()
    return () => {
      if (wsRef.current) wsRef.current.close()
    }
  }, [connectWs])

  const fetchTasks = () => fetchRest()

  return { vencidas, hoy, proximas, summary, loading, error, fetchTasks }
}

export default useHoy
