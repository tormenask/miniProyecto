import { useParams } from "react-router-dom"

function Actividad() {
  const { id } = useParams()
  
  return (
    <div>
      <h1>Actividad {id}</h1>
    </div>
  )
}

export default Actividad
