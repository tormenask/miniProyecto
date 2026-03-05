// Mantiene compatibilidad con el uso existente en todas las páginas.
// Delega a Alert con type="danger".
import Alert from './Alert'

export default function ErrorAlert({ mensaje }) {
  return <Alert mensaje={mensaje} type="danger" />
}
