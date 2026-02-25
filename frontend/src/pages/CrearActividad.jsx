import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Save, ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import Navbar from "../components/Navbar";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

function CrearActividad() {
  const navigate = useNavigate();
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  // Estado inicial del formulario (coincide con los campos del backend)
  const [formData, setFormData] = useState({
    titulo: "",
    tipo: "other",
    curso: "",
    descripcion: "",
    fecha_evento: "",
    fecha_limite: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setError(null);

    try {
      const token = localStorage.getItem("access_token");

      if (!token) {
        throw new Error("No tienes una sesión activa. Inicia sesión.");
      }

      // Preparar los datos (limpiar campos vacíos si es necesario)
      const payload = {
        ...formData,
        fecha_evento: formData.fecha_evento || null,
        fecha_limite: formData.fecha_limite || null
      };

      const response = await fetch(`${API_URL}/api/activities/`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        // Si el backend devuelve errores de validación (400)
        if (response.status === 400) {
          const mensajes = Object.values(errorData).flat().join(" ");
          throw new Error(mensajes || "Revisa los datos ingresados.");
        }
        throw new Error("Error al guardar. Verifica la conexión con el servidor.");
      }

      // Si todo sale bien, volvemos al listado
      navigate("/Actividades");

    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-2xl mx-auto px-6 py-10">
        <button
          onClick={() => navigate("/Actividades")}
          className="flex items-center text-gray-500 hover:text-black mb-6 transition-colors"
        >
          <ArrowLeft size={18} className="mr-2" />
          Volver a mis actividades
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Nueva Actividad</h1>
          <p className="text-gray-500 mb-8">Completa los detalles de tu tarea o examen.</p>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
              <AlertCircle size={18} />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Título */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Título de la actividad *</label>
              <input
                type="text"
                name="titulo"
                required
                value={formData.titulo}
                onChange={handleChange}
                placeholder="Ej: Examen Final de Cálculo"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Curso */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Curso / Materia *</label>
                <input
                  type="text"
                  name="curso"
                  required
                  value={formData.curso}
                  onChange={handleChange}
                  placeholder="Ej: Matemáticas"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black outline-none"
                />
              </div>

              {/* Tipo */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Tipo</label>
                <select
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black outline-none bg-white"
                >
                  <option value="exam">Examen</option>
                  <option value="quiz">Quiz</option>
                  <option value="workshop">Taller</option>
                  <option value="project">Proyecto</option>
                  <option value="other">Otro</option>
                </select>
              </div>
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Descripción (Opcional)</label>
              <textarea
                name="descripcion"
                rows="3"
                value={formData.descripcion}
                onChange={handleChange}
                placeholder="Detalles adicionales..."
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black outline-none resize-none"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Fecha Evento */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Fecha y Hora del Evento</label>
                <input
                  type="datetime-local"
                  name="fecha_evento"
                  value={formData.fecha_evento}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black outline-none"
                />
              </div>

              {/* Fecha Límite */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Fecha Límite de Entrega</label>
                <input
                  type="date"
                  name="fecha_limite"
                  value={formData.fecha_limite}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={cargando}
              className="w-full bg-black text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-gray-800 disabled:bg-gray-400 transition-colors"
            >
              {cargando ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <Save size={20} />
              )}
              {cargando ? "Guardando..." : "Crear Actividad"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CrearActividad;