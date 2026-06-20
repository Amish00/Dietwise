const Select = ({ label, options = [], className = '', ...props }) => (
  <div className="w-full">
    {label && <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">{label}</label>}
    <select className={`input-base appearance-none ${className}`} {...props}>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
)
export default Select
