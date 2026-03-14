import { useState, useEffect } from 'react'
import { authFetch } from '../utils/auth'

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

// Caché a nivel de módulo: se comparte entre todos los componentes
let _cache = null          // datos del perfil
let _promise = null        // promesa en vuelo (evita peticiones paralelas)
const _listeners = new Set()

function notifyListeners() {
  _listeners.forEach(fn => fn(_cache))
}

async function fetchProfile() {
  if (_cache) return _cache
  if (_promise) return _promise

  _promise = authFetch(`${API_URL}/api/users/profile/`)
    .then(res => res.ok ? res.json() : null)
    .then(data => {
      _cache = data
      _promise = null
      notifyListeners()
      return data
    })
    .catch(() => { _promise = null; return null })

  return _promise
}

/** Invalida la caché (llamar después de un PATCH al perfil) */
export function invalidateProfileCache() {
  _cache = null
  _promise = null
}

function useProfile() {
  const [perfil, setPerfil] = useState(_cache)

  useEffect(() => {
    if (_cache) {
      setPerfil(_cache)
      return
    }
    let alive = true
    fetchProfile().then(data => { if (alive) setPerfil(data) })
    _listeners.add(setPerfil)
    return () => {
      alive = false
      _listeners.delete(setPerfil)
    }
  }, [])

  return perfil
}

export default useProfile
