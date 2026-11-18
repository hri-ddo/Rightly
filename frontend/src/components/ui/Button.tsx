import { Link, type LinkProps } from 'react-router-dom'

type Variant = 'primary' | 'secondary' | 'outline' | 'danger'

const variantClass: Record<Variant, string> = {
  primary:
    'bg-primary-container text-on-primary-container hover:bg-primary-fixed-dim border border-primary-container',
  secondary:
    'bg-inverse-surface text-inverse-on-surface hover:bg-on-surface border border-inverse-surface',
  outline:
    'bg-transparent text-on-surface border border-outline-variant hover:border-on-surface hover:bg-surface-container-lowest',
  danger: 'bg-error text-on-error hover:bg-error/90 border border-error',
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
}

export function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center gap-2 rounded-default px-4 py-2.5 text-sm font-semibold transition-colors disabled:opacity-50 ${variantClass[variant]} ${className}`}
      {...props}
    />
  )
}

export function ButtonLink({
  variant = 'primary',
  className = '',
  ...props
}: LinkProps & { variant?: Variant }) {
  return (
    <Link
      className={`inline-flex items-center justify-center gap-2 rounded-default px-4 py-2.5 text-sm font-semibold transition-colors ${variantClass[variant]} ${className}`}
      {...props}
    />
  )
}