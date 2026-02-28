import { AlertCircle } from "lucide-react"

function ErrorAlert({ mensaje }) {
    if (!mensaje) return null
    return (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
            <AlertCircle size={16} />
            <p className="text-sm font-medium">{mensaje}</p>
        </div>
    )
}

export default ErrorAlert