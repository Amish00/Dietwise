const PageWrapper = ({ children, title, subtitle, action }) => (
  <div className="max-w-7xl mx-auto px-4 py-6">
    {(title || action) && (
      <div className="flex items-start justify-between mb-6">
        <div>
          {title    && <h1 className="text-2xl font-black tracking-tight">{title}</h1>}
          {subtitle && <p className="text-brand-muted text-sm mt-1">{subtitle}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>
    )}
    {children}
  </div>
)

export default PageWrapper
