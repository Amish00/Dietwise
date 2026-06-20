const MacroBar = ({ label, value, max, color }) => {
  const pct  = Math.min((value / (max || 1)) * 100, 100)
  const over = value > max
  return (
    <div className="mb-3">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs font-semibold text-gray-500">{label}</span>
        <span className={`text-xs font-bold ${over ? 'text-red-500' : 'text-gray-700'}`}>
          {Math.round(value)}g / {max}g
        </span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: over ? '#ef4444' : color }} />
      </div>
    </div>
  )
}
export default MacroBar
