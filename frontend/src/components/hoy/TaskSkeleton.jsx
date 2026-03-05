function SkeletonCard() {
    return (
        <div className="bg-white rounded-lg p-4 border border-gray-100 space-y-2 animate-pulse">
            <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-gray-200 rounded" />
                <div className="h-3 bg-gray-200 rounded w-2/3" />
            </div>
            <div className="h-2.5 bg-gray-100 rounded w-1/2 ml-7" />
        </div>
    )
}

function TaskSkeleton() {
    return (
        <div className="space-y-6">
            <div className="bg-white rounded-lg p-4 border border-gray-100 space-y-2 animate-pulse">
                <div className="h-2.5 bg-gray-200 rounded w-3/4" />
                <div className="h-2.5 bg-gray-200 rounded w-1/2" />
                <div className="h-2.5 bg-gray-200 rounded w-2/3" />
            </div>
            {["Vencidas", "Hoy", "Próximas"].map((label) => (
                <div key={label} className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-20 animate-pulse" />
                    <SkeletonCard />
                    <SkeletonCard />
                </div>
            ))}
        </div>
    )
}

export default TaskSkeleton