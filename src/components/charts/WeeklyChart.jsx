import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ResponsiveContainer, ReferenceLine } from 'recharts'

const Tip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-3 text-sm shadow-lg">
      <p className="font-bold text-gray-800 mb-1">{label}</p>
      <p className="text-primary">{payload[0].value} kcal</p>
    </div>
  )
}
const WeeklyChart = ({ data, target }) => (
  <ResponsiveContainer width="100%" height={190}>
    <BarChart data={data} barSize={28}>
      <XAxis dataKey="day" tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={false} tickLine={false} />
      <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} width={38} />
      <Tooltip content={<Tip />} cursor={{ fill: 'rgba(99,102,241,0.05)' }} />
      <ReferenceLine y={target} stroke="#6366f1" strokeDasharray="4 4" strokeOpacity={0.4} />
      <Bar dataKey="calories" radius={[6, 6, 0, 0]}>
        {data.map((d, i) => (
          <Cell key={i} fill={d.calories > target ? '#ef4444' : d.calories > target * 0.88 ? '#f59e0b' : '#6366f1'} />
        ))}
      </Bar>
    </BarChart>
  </ResponsiveContainer>
)
export default WeeklyChart
