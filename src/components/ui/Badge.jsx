const colors = {
  green:  'bg-emerald-50 text-emerald-700 border-emerald-200',
  amber:  'bg-amber-50  text-amber-700  border-amber-200',
  red:    'bg-red-50    text-red-700    border-red-200',
  blue:   'bg-blue-50   text-blue-700   border-blue-200',
  purple: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  gray:   'bg-gray-100  text-gray-600   border-gray-200',
}
const Badge = ({ children, color = 'gray', className = '' }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${colors[color]} ${className}`}>
    {children}
  </span>
)
export default Badge
