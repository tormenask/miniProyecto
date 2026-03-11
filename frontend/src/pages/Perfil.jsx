import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Mail, Lock, Settings2, Save, Eye, EyeOff, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import Navbar from '../components/Navbar'
import { authFetch } from '../utils/auth'

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

function SectionCard({ icon, title, children }) {
  return (
    <div className="bg-white rounded-xl border border-[#E1E4E7] shadow-sm p-6">
      <div className="flex items-center gap-2 mb-5">
        <div className="text-brand">{icon}</div>
        <h2 className="text-base font-bold text-[#1A1A1A]">{title}</h2>
      </div>
      {children}
    </div>
  )
}

function Toast({ mensaje, tipo }) {
  if (!mensaje) return null
  const esError = tipo === 'error'
  return (
    <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium border
      ${esError
        ? 'bg-red-50 border-red-200 text-red-700'
        : 'bg-success-bg border-success-border text-success-text'
      }`}
    >
      {esError ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
      {mensaje}
    </div>
  )
}

const inputCls = 'w-full border border-[#E1E4E7] rounded-lg px-3 py-2.5 text-sm text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-brand transition-all'

export default function Perfil() {
  const navigate = useNavigate()

  // Datos personales
  const [perfil, setPerfil] = useState({ username: '', email: '', first_name: '', last_name: '', limite_horas_diarias: 6, date_joined: '' })
  const [form, setForm] = useState({ username: '', email: '', first_name: '', last_name: '' })
  const [limite, setLimite] = useState(6)
  const [cargando, setCargando] = useState(true)
  const [errorCarga, setErrorCarga] = useState(false)
  const [guardandoPerfil, setGuardandoPerfil] = useState(false)
  const [toastPerfil, setToastPerfil] = useState(null)

  // Contraseña
  const [passForm, setPassForm] = useState({ current_password: '', new_password: '', confirm_password: '' })
  const [guardandoPass, setGuardandoPass] = useState(false)
  const [toastPass, setToastPass] = useState(null)
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (!token) { setCargando(false); return }
    fetch(`${API_URL}/api/users/profile/`, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
    })
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then(data => {
        setPerfil(data)
        setForm({
          username: data.username || '',
          email: data.email || '',
          first_name: data.first_name || '',
          last_name: data.last_name || '',
        })
        setLimite(parseFloat(data.limite_horas_diarias) || 6)
      })
      .catch(() => setErrorCarga(true))
      .finally(() => setCargando(false))
  }, [])

  const mostrarToast = (setter, mensaje, tipo = 'ok') => {
    setter({ mensaje, tipo })
    setTimeout(() => setter(null), 4000)
  }

  const handleGuardarPerfil = async (e) => {
    e.preventDefault()
    setGuardandoPerfil(true)
    setToastPerfil(null)

    const cambios = {}
    if (form.username !== perfil.username) cambios.username = form.username
    if (form.email !== perfil.email) cambios.email = form.email
    if (form.first_name !== perfil.first_name) cambios.first_name = form.first_name
    if (form.last_name !== perfil.last_name) cambios.last_name = form.last_name
    if (limite !== parseFloat(perfil.limite_horas_diarias)) cambios.limite_horas_diarias = limite

    if (Object.keys(cambios).length === 0) {
      setGuardandoPerfil(false)
      mostrarToast(setToastPerfil, 'No hay cambios para guardar.', 'error')
      return
    }

    try {
      const res = await authFetch(`${API_URL}/api/users/profile/`, {
        method: 'PATCH',
        body: JSON.stringify(cambios),
      })
      const data = await res.json()
      if (!res.ok) {
        mostrarToast(setToastPerfil, data.error || 'Error al guardar los cambios.', 'error')
        return
      }
      setPerfil(data)
      setForm({ username: data.username, email: data.email, first_name: data.first_name || '', last_name: data.last_name || '' })
      setLimite(parseFloat(data.limite_horas_diarias) || 6)
      if (data.username) localStorage.setItem('username', data.username)
      mostrarToast(setToastPerfil, 'Perfil actualizado correctamente.')
    } catch {
      mostrarToast(setToastPerfil, 'No se pudo conectar al servidor.', 'error')
    } finally {
      setGuardandoPerfil(false)
    }
  }

  const handleCambiarPassword = async (e) => {
    e.preventDefault()
    if (passForm.new_password !== passForm.confirm_password) {
      mostrarToast(setToastPass, 'Las contraseñas nuevas no coinciden.', 'error')
      return
    }
    if (passForm.new_password.length < 6) {
      mostrarToast(setToastPass, 'La nueva contraseña debe tener al menos 6 caracteres.', 'error')
      return
    }
    setGuardandoPass(true)
    setToastPass(null)
    try {
      const res = await authFetch(`${API_URL}/api/users/change-password/`, {
        method: 'POST',
        body: JSON.stringify({ current_password: passForm.current_password, new_password: passForm.new_password }),
      })
      const data = await res.json()
      if (!res.ok) {
        mostrarToast(setToastPass, data.error || 'Error al cambiar la contraseña.', 'error')
        return
      }
      setPassForm({ current_password: '', new_password: '', confirm_password: '' })
      mostrarToast(setToastPass, data.message || 'Contraseña actualizada correctamente.')
    } catch {
      mostrarToast(setToastPass, 'No se pudo conectar al servidor.', 'error')
    } finally {
      setGuardandoPass(false)
    }
  }

  if (cargando) {
    return (
      <div className="min-h-screen bg-app-bg font-sans">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 py-10 space-y-6 animate-pulse">
          <div className="bg-white rounded-xl border border-[#E1E4E7] p-6 flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-gray-200 shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-5 bg-gray-200 rounded w-40" />
              <div className="h-3.5 bg-gray-100 rounded w-24" />
              <div className="h-3 bg-gray-100 rounded w-32" />
            </div>
          </div>
          <div className="bg-white rounded-xl border border-[#E1E4E7] p-6 space-y-4">
            <div className="h-5 bg-gray-200 rounded w-48 mb-2" />
            <div className="grid grid-cols-2 gap-4">
              <div className="h-10 bg-gray-100 rounded-lg" />
              <div className="h-10 bg-gray-100 rounded-lg" />
            </div>
            <div className="h-10 bg-gray-100 rounded-lg" />
            <div className="h-10 bg-gray-100 rounded-lg" />
            <div className="h-10 bg-gray-100 rounded-lg" />
            <div className="h-11 bg-gray-200 rounded-lg" />
          </div>
          <div className="bg-white rounded-xl border border-[#E1E4E7] p-6 space-y-4">
            <div className="h-5 bg-gray-200 rounded w-28 mb-2" />
            <div className="h-10 bg-gray-100 rounded-lg" />
            <div className="h-10 bg-gray-100 rounded-lg" />
            <div className="h-10 bg-gray-100 rounded-lg" />
            <div className="h-11 bg-gray-200 rounded-lg" />
          </div>
        </div>
      </div>
    )
  }

  if (errorCarga) {
    return (
      <div className="min-h-screen bg-app-bg font-sans">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <AlertCircle size={36} className="mx-auto mb-3 text-danger-text opacity-70" />
          <p className="text-base font-bold text-[#1A1A1A] mb-1">No se pudo cargar el perfil</p>
          <p className="text-sm text-gray-400 mb-6">Revisa tu conexión o intenta de nuevo.</p>
          <button type="button" onClick={() => { setErrorCarga(false); setCargando(true); window.location.reload() }}
            className="bg-brand hover:bg-brand-hover text-white font-bold px-6 py-2.5 rounded-lg text-sm transition-colors">
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  const iniciales = [perfil.first_name?.[0], perfil.last_name?.[0]].filter(Boolean).join('').toUpperCase() || perfil.username?.[0]?.toUpperCase() || 'U'
  const nombreCompleto = [perfil.first_name, perfil.last_name].filter(Boolean).join(' ') || perfil.username

  return (
    <div className="min-h-screen bg-app-bg font-sans">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">

        {/* Header de perfil */}
        <div className="bg-white rounded-xl border border-[#E1E4E7] shadow-sm p-6 flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-brand flex items-center justify-center text-white text-xl font-bold shrink-0">
            {iniciales}
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#1A1A1A]">{nombreCompleto}</h1>
            <p className="text-sm text-gray-400">@{perfil.username}</p>
            {perfil.date_joined && (
              <p className="text-xs text-gray-400 mt-0.5">
                Miembro desde {new Date(perfil.date_joined).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
              </p>
            )}
          </div>
        </div>

        {/* Sección datos personales + preferencias */}
        <SectionCard icon={<User size={18} />} title="Datos personales y preferencias">
          <form onSubmit={handleGuardarPerfil} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Nombre</label>
                <input type="text" value={form.first_name}
                  onChange={e => setForm(p => ({ ...p, first_name: e.target.value }))}
                  placeholder="Juan" className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Apellido</label>
                <input type="text" value={form.last_name}
                  onChange={e => setForm(p => ({ ...p, last_name: e.target.value }))}
                  placeholder="Pérez" className={inputCls} />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Nombre de usuario</label>
              <input type="text" value={form.username}
                onChange={e => setForm(p => ({ ...p, username: e.target.value }))}
                className={inputCls} />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 flex items-center gap-1">
                <Mail size={12} /> Email
              </label>
              <input type="email" value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                placeholder="tu@email.com" className={inputCls} />
            </div>

            <div className="border-t border-[#E1E4E7] pt-4">
              <label className="block text-xs font-semibold text-gray-500 mb-1 flex items-center gap-1">
                <Settings2 size={12} /> Límite de horas diarias
              </label>
              <div className="flex items-center gap-3">
                <input type="number" min="1" max="16" step="0.5" value={limite}
                  onChange={e => setLimite(parseFloat(e.target.value))}
                  className="w-24 px-3 py-2.5 text-sm border border-[#E1E4E7] rounded-lg focus:ring-2 focus:ring-brand outline-none text-center font-bold" />
                <span className="text-sm text-gray-400">horas/día</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Se usará para detectar conflictos de planificación en tus subactividades.
              </p>
            </div>

            {toastPerfil && <Toast mensaje={toastPerfil.mensaje} tipo={toastPerfil.tipo} />}

            <button type="submit" disabled={guardandoPerfil}
              className="flex items-center justify-center gap-2 w-full bg-brand hover:bg-brand-hover text-white font-bold rounded-lg py-2.5 text-sm transition-colors disabled:opacity-50">
              {guardandoPerfil ? <><Loader2 size={15} className="animate-spin" /> Guardando...</> : <><Save size={15} /> Guardar cambios</>}
            </button>
          </form>
        </SectionCard>

        {/* Sección seguridad */}
        <SectionCard icon={<Lock size={18} />} title="Seguridad">
          <form onSubmit={handleCambiarPassword} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Contraseña actual</label>
              <div className="relative">
                <input type={showCurrent ? 'text' : 'password'} value={passForm.current_password}
                  onChange={e => setPassForm(p => ({ ...p, current_password: e.target.value }))}
                  placeholder="••••••••" className={`${inputCls} pr-10`} />
                <button type="button" onClick={() => setShowCurrent(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand transition-colors">
                  {showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Nueva contraseña</label>
              <div className="relative">
                <input type={showNew ? 'text' : 'password'} value={passForm.new_password}
                  onChange={e => setPassForm(p => ({ ...p, new_password: e.target.value }))}
                  placeholder="Mínimo 6 caracteres" className={`${inputCls} pr-10`} />
                <button type="button" onClick={() => setShowNew(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand transition-colors">
                  {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Confirmar nueva contraseña</label>
              <input type="password" value={passForm.confirm_password}
                onChange={e => setPassForm(p => ({ ...p, confirm_password: e.target.value }))}
                placeholder="Repite la nueva contraseña" className={inputCls} />
              {passForm.confirm_password && passForm.new_password !== passForm.confirm_password && (
                <p className="text-xs text-danger-text mt-1">Las contraseñas no coinciden.</p>
              )}
            </div>

            {toastPass && <Toast mensaje={toastPass.mensaje} tipo={toastPass.tipo} />}

            <button type="submit"
              disabled={guardandoPass || !passForm.current_password || !passForm.new_password || passForm.new_password !== passForm.confirm_password}
              className="flex items-center justify-center gap-2 w-full bg-brand hover:bg-brand-hover text-white font-bold rounded-lg py-2.5 text-sm transition-colors disabled:opacity-50">
              {guardandoPass ? <><Loader2 size={15} className="animate-spin" /> Cambiando...</> : <><Lock size={15} /> Cambiar contraseña</>}
            </button>
          </form>
        </SectionCard>

      </div>
    </div>
  )
}
