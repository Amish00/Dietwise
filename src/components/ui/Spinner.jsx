const Spinner = ({ size = 'md', text }) => {
  const s = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-10 h-10' }
  return (
    <div className="flex flex-col items-center gap-3">
      <div className={`${s[size]} border-2 border-gray-200 border-t-primary rounded-full animate-spin`} />
      {text && <p className="text-sm text-gray-500">{text}</p>}
    </div>
  )
}
export default Spinner
