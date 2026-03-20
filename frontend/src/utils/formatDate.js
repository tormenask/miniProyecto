/**
 * Convierte "2026-03-19" a "19 de marzo"
 * Usa construcción manual de fecha para evitar desfase de zona horaria.
 */
export function formatearFechaSugerencia(dateString) {
  const [year, month, day] = dateString.split('-').map(Number)
  const fecha = new Date(year, month - 1, day)
  return fecha.toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'long',
  })
}
