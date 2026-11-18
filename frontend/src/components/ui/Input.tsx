export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const { className = '', ...rest } = props
  return (
    <input
      className={`w-full rounded-default border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm text-on-surface placeholder:text-outline focus:border-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container/40 ${className}`}
      {...rest}
    />
  )
}

export function Label({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1 block text-xs font-semibold uppercase tracking-wider text-on-surface-variant"
    >
      {children}
    </label>
  )
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { className = '', ...rest } = props
  return (
    <textarea
      className={`w-full rounded-default border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm text-on-surface placeholder:text-outline focus:border-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container/40 ${className}`}
      rows={4}
      {...rest}
    />
  )
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  const { className = '', children, ...rest } = props
  return (
    <select
      className={`w-full rounded-default border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm text-on-surface focus:border-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container/40 ${className}`}
      {...rest}
    >
      {children}
    </select>
  )
}