type Variant = 'error' | 'info'

export function Alert({
  variant = 'info',
  title,
  children,
  action,
}: {
  variant?: Variant
  title?: string
  children: React.ReactNode
  action?: React.ReactNode
}) {
  const styles =
    variant === 'error'
      ? 'border-error/30 bg-error-container text-on-surface'
      : 'border-outline-variant bg-surface-container-low text-on-surface'

  return (
    <div className={`rounded-default border px-4 py-3 ${styles}`} role="alert">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          {title ? <p className="text-sm font-semibold">{title}</p> : null}
          <div className="text-sm text-on-surface-variant">{children}</div>
        </div>
        {action}
      </div>
    </div>
  )
}