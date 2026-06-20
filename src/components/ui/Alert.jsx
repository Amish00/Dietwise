const types = {
  error:   'bg-red-50    border-red-200   text-red-700',
  success: 'bg-green-50  border-green-200 text-green-700',
  warning: 'bg-amber-50  border-amber-200 text-amber-700',
  info:    'bg-blue-50   border-blue-200  text-blue-700',
}
const Alert = ({ type = 'info', children, onClose }) => (
  <div className={`flex items-start gap-3 p-4 rounded-xl border text-sm ${types[type]}`}>
    <span className="flex-1">{children}</span>
    {onClose && <button onClick={onClose} className="opacity-60 hover:opacity-100 text-lg leading-none">×</button>}
  </div>
)
export default Alert
