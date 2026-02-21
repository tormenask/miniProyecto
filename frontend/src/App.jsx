import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Hoy from './pages/Hoy'
import Crear from './pages/Crear'
import Actividad from './pages/Actividad'
import Progreso from './pages/Progreso'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/hoy" element={<Hoy />} />
        <Route path="/crear" element={<Crear />} />
        <Route path="/actividad/:id" element={<Actividad />} />
        <Route path="/progreso" element={<Progreso />} />
      </Routes>
    </Router>
  )
}

export default App