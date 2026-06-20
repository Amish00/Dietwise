const Card = ({ children, className = '', hover = false, onClick }) => (
  <div onClick={onClick}
    className={`bg-white border border-gray-200 rounded-xl p-5 shadow-card
      ${hover ? 'card-hover cursor-pointer' : ''} ${className}`}>
    {children}
  </div>
)
export const CardTitle = ({ children, className = '' }) => (
  <p className={`text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 ${className}`}>{children}</p>
)
export default Card
