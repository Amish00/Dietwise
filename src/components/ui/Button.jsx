const variants = {
  primary:   'bg-primary text-white hover:bg-primary-dark disabled:bg-primary-light disabled:cursor-not-allowed',
  secondary: 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200',
  danger:    'bg-red-500 text-white hover:bg-red-600',
  ghost:     'bg-transparent text-gray-500 hover:bg-gray-100 hover:text-gray-700',
  outline:   'bg-white border border-primary text-primary hover:bg-indigo-50',
}
const sizes = {
  sm: 'px-3 py-1.5 text-xs rounded-lg',
  md: 'px-4 py-2.5 text-sm rounded-lg',
  lg: 'px-6 py-3 text-base rounded-xl',
}

const Button = ({ children, variant = 'primary', size = 'md', className = '', disabled, onClick, type = 'button', full }) => (
  <button type={type} onClick={onClick} disabled={disabled}
    className={`font-semibold transition-all duration-150 cursor-pointer inline-flex items-center justify-center gap-2
      ${variants[variant]} ${sizes[size]} ${full ? 'w-full' : ''} ${className}`}>
    {children}
  </button>
)
export default Button
