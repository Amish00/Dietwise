import { AlertCircle, X, Settings } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const AIErrorBanner = ({ error, onClose }) => {
  const nav = useNavigate()
  if (!error) return null
  return (
    <div className="flex items-start gap-3 bg-brand-red/10 border border-brand-red/30 rounded-xl p-4 mb-4">
      <AlertCircle size={18} className="text-brand-red mt-0.5 shrink-0" />
      <div className="flex-1 text-sm">
        <span className="text-brand-red font-semibold">AI Error: </span>
        <span className="text-brand-text/80">{error}</span>
        {error.includes('API key') && (
          <button onClick={() => nav('/settings')} className="ml-2 text-brand-green underline inline-flex items-center gap-1">
            <Settings size={12} /> Open Settings
          </button>
        )}
      </div>
      <button onClick={onClose} className="text-brand-muted hover:text-brand-text">
        <X size={16} />
      </button>
    </div>
  )
}

export default AIErrorBanner
