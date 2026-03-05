import TaskCard from "./TaskCard"

function Section({ label, color, items, onClickItem }) {
    if (items.length === 0) return null
    return (
        <div className="space-y-2">
            <p className={`text-xs font-bold uppercase tracking-widest ${color}`}>{label}</p>
            {items.map((act) => (
                <TaskCard key={act.id} actividad={act} onClick={() => onClickItem(act.id)} />
            ))}
        </div>
    )
}

export default Section