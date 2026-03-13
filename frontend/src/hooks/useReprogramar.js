import { useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

/**
 * Hook para reprogramar subtareas directamente (sin useSubtareas context).
 * Usado en SubtareaHoyCard y otros lugares que no tienen actividadId en hook.
 */
function useReprogramar() {
  const [conflicto, setConflicto] = useState(null) // null | { subtareaId, actividadId, data }
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState(null)

  const patch = async (actividadId, subtareaId, body) => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      window.location.href = '/login'
      return { ok: false }
    }
    const res = await fetch(`${API_URL}/api/activities/${actividadId}/subtasks/${subtareaId}/`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (res.status === 401) {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      localStorage.setItem('session_expired', '1')
      window.location.href = '/login'
      return { ok: false }
    }
    if (res.status === 409) {
      const data = await res.json()
      return { ok: false, conflicto: true, data }
    }
    if (!res.ok) {
      let mensaje = null
      try {
        const data = await res.json()
        const fields = data?.error?.fields
        // Extraer el mensaje de validación específico del campo
        if (fields) mensaje = Object.values(fields).join(' ')
        else if (data?.error?.message) mensaje = data.error.message
      } catch { /* body no es JSON */ }
      return { ok: false, conflicto: false, mensaje }
    }
    const updated = await res.json()
    return { ok: true, data: updated }
  }

  /**
   * Reprograma una subtarea. Si hay conflicto, guarda el estado del conflicto.
   * @returns {object|null} updated subtask data si ok, null si conflicto o error
   */
  const reprogramar = async (actividadId, subtareaId, nuevaFecha, extras = {}) => {
    setCargando(true)
    setError(null)
    setConflicto(null)
    try {
      const result = await patch(actividadId, subtareaId, { fecha_objetivo: nuevaFecha, ...extras })
      if (result.ok) return result.data
      if (result.conflicto) {
        setConflicto({ subtareaId, actividadId, data: result.data })
        return null
      }
      setError(result.mensaje ?? 'Error al guardar los cambios.')
      return null
    } catch {
      setError('Error de conexión. Intenta de nuevo.')
      return null
    } finally {
      setCargando(false)
    }
  }

  /**
   * Resuelve el conflicto activo con un body arbitrario (mover, reducir, forzar).
   */
  const resolverConflicto = async (body) => {
    if (!conflicto) return null
    setCargando(true)
    setError(null)
    try {
      const result = await patch(conflicto.actividadId, conflicto.subtareaId, body)
      if (result.ok) {
        setConflicto(null)
        return result.data
      }
      if (result.conflicto) {
        setConflicto(prev => ({ ...prev, data: result.data }))
        return null
      }
      setError(result.mensaje ?? 'Error al guardar los cambios.')
      return null
    } catch {
      setError('Error de conexión. Intenta de nuevo.')
      return null
    } finally {
      setCargando(false)
    }
  }

  const limpiarConflicto = () => { setConflicto(null); setError(null) }

  return { reprogramar, resolverConflicto, limpiarConflicto, conflicto, cargando, error }
}

export default useReprogramar
