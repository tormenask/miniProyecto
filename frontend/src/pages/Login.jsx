import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Glow blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600 rounded-full opacity-10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500 rounded-full opacity-10 blur-3xl pointer-events-none" />

      {/* Card */}
      <div className="relative w-full max-w-sm">
        {/* Border glow */}
        <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-violet-500/40 via-transparent to-cyan-500/40 pointer-events-none" />

        <div className="relative bg-zinc-900/90 backdrop-blur-xl rounded-2xl p-8 border border-white/5 shadow-2xl">
          {/* Logo mark */}
          <div className="mb-8 flex flex-col items-start gap-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-400 flex items-center justify-center shadow-lg">
                <svg viewBox="0 0 16 16" className="w-4 h-4 fill-white">
                  <path d="M8 1L15 5V11L8 15L1 11V5L8 1Z" />
                </svg>
              </div>
              <span
                className="text-white font-bold tracking-tight"
                style={{ fontFamily: "'DM Mono', monospace", fontSize: "15px" }}
              >
                acme
              </span>
            </div>
            <h1
              className="text-white text-2xl font-semibold tracking-tight leading-tight"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Bienvenido de vuelta
            </h1>
            <p className="text-zinc-400 text-sm">
              Ingresa tus credenciales para continuar
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-400 tracking-widest uppercase">
                Correo
              </label>
              <div
                className={`relative rounded-xl border transition-all duration-200 ${
                  focused === "email"
                    ? "border-violet-500/70 shadow-[0_0_0_3px_rgba(139,92,246,0.12)]"
                    : "border-white/10"
                }`}
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused(null)}
                  placeholder="tu@correo.com"
                  className="w-full bg-zinc-800/50 text-white placeholder-zinc-600 rounded-xl px-4 py-3 text-sm outline-none"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-400 tracking-widest uppercase">
                Contraseña
              </label>
              <div
                className={`relative rounded-xl border transition-all duration-200 ${
                  focused === "password"
                    ? "border-violet-500/70 shadow-[0_0_0_3px_rgba(139,92,246,0.12)]"
                    : "border-white/10"
                }`}
              >
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused(null)}
                  placeholder="••••••••"
                  className="w-full bg-zinc-800/50 text-white placeholder-zinc-600 rounded-xl px-4 py-3 pr-11 text-sm outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Forgot password */}
            <div className="flex justify-end">
              <button
                type="button"
                className="text-xs text-violet-400 hover:text-violet-300 transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 relative rounded-xl py-3 text-sm font-semibold text-white overflow-hidden transition-all duration-200 hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Entrando...
                </span>
              ) : (
                "Iniciar sesión"
              )}
            </button>
          </form>

          {/* Sign up */}
          <p className="text-center text-sm text-zinc-500 mt-6">
            ¿No tienes cuenta?{" "}
            <button className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
              Regístrate
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}