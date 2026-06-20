const Input = ({ label, error, className = '', as: Tag = 'input', ...props }) => (
  <div className="w-full">
    {label && <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">{label}</label>}
    <Tag className={`input-base ${error ? 'border-red-400' : ''} ${className}`} {...props} />
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
)
export default Input
