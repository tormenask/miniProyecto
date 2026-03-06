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

    return (
        <div className="space-y-6">
            <SortRules />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                <Section label="Vencidas" color="text-red-400" items={vencidas} onClickItem={(id) => navigate(`/actividad/${id}`)} />
                <Section label="Hoy" color="text-blue-500" items={hoy} onClickItem={(id) => navigate(`/actividad/${id}`)} />
                <Section label="Próximas" color="text-green-500" items={proximas} onClickItem={(id) => navigate(`/actividad/${id}`)} />
            </div>
        </div>
    )
}

export default TodayView