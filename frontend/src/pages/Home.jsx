import { useEffect, useState } from "react"

function Home() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch("https://miniproyecto-back.onrender.com/api/users/")
      .then(res => res.json())
      .then(data => {
        console.log("Datos recibidos:", data)
        setUsers(data)
        setLoading(false)
      })
      .catch(err => {
        console.error("Error al traer usuarios:", err)
        alert(`❌ Error: ${err.message}\n¿Está corriendo el servidor en https://miniproyecto-back.onrender.com/?`)
        setError(err.message)
        setLoading(false)
      })
  }, [])

  if (loading) return <div>Cargando usuarios...</div>
  if (error) return <div>Error: {error}. ¿Está corriendo el servidor en localhost:8000?</div>

  return (
    <div>
      <h1>Usuarios</h1>
      {users.length === 0 ? (
        <p>No hay usuarios</p>
      ) : (
        users.map(user => (
          <div key={user.id}>
            <p>{user.name} - {user.age}</p>
          </div>
        ))
      )}
    </div>
  )
}

export default Home
