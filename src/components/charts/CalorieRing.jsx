const CalorieRing = ({ eaten, target, size = 180 }) => {
  const r   = size * 0.38
  const cx  = size / 2
  const cy  = size / 2
  const circ = 2 * Math.PI * r
  const pct  = Math.min((eaten / target) * 100, 110)
  const over = eaten > target
  const color = over ? '#ef4444' : pct > 85 ? '#f59e0b' : '#6366f1'
  const dash  = (Math.min(pct, 100) / 100) * circ

  return (
    <svg width={size} height={size} className="block mx-auto">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e5e7eb" strokeWidth={size * 0.075} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={color}
        strokeWidth={size * 0.075} strokeLinecap="round"
        strokeDasharray={`${dash} ${circ}`}
        transform={`rotate(-90 ${cx} ${cy})`}
        style={{ transition: 'stroke-dasharray 0.9s cubic-bezier(0.4,0,0.2,1), stroke 0.4s' }}
      />
      <text x={cx} y={cy - size * 0.05} textAnchor="middle" fill="#111827" fontSize={size * 0.155} fontWeight="800">{eaten}</text>
      <text x={cx} y={cy + size * 0.09} textAnchor="middle" fill="#9ca3af" fontSize={size * 0.07}>of {target} kcal</text>
      <text x={cx} y={cy + size * 0.2} textAnchor="middle" fill={color} fontSize={size * 0.065} fontWeight="700">
        {over ? `${eaten - target} over` : `${target - eaten} left`}
      </text>
    </svg>
  )
}
export default CalorieRing
