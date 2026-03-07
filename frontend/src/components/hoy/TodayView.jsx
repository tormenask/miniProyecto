import { useNavigate } from "react-router-dom"
import TaskSkeleton from "./TaskSkeleton"
import EmptyTasks from "./EmptyTasks"
import ErrorState from "./ErrorState"
import SortRules from "./SortRules"
import Section from "./Section"

function TodayView({ loading, error, vencidas, hoy, proximas, retryFetch }) {
    const navigate = useNavigate()

    if (loading) return <TaskSkeleton />
    if (error) return <ErrorState onReintentar={retryFetch} />

    const hayTareas = vencidas.length > 0 || hoy.length > 0 || proximas.length > 0
    if (!hayTareas) return <EmptyTasks onCrear={() => navigate("/CrearActividad")} />

    const goToActividad = (id) => navigate(`/actividad/${id}`, { state: { from: '/hoy' } })

    return (
        <div>
            <SortRules />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start mt-4">
                <Section variante="vencidas" items={vencidas} onClickItem={goToActividad} />
                <Section variante="hoy" items={hoy} onClickItem={goToActividad} />
                <Section variante="proximas" items={proximas} onClickItem={goToActividad} />
            </div>
        </div>
    )
}

export default TodayView