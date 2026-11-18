import type { VerificationStatus } from '../types/api'

const labels: Record<VerificationStatus, string> = {
  UNVERIFIED: 'Not verified',
  PENDING: 'Verification pending',
  VERIFIED: 'NID verified',
  REJECTED: 'Verification rejected',
}

const styles: Record<VerificationStatus, string> = {
  UNVERIFIED: 'border-outline-variant bg-surface-container text-on-surface-variant',
  PENDING: 'border-primary-fixed-dim bg-primary-fixed/30 text-on-primary-fixed-variant',
  VERIFIED: 'border-success/30 bg-white text-success',
  REJECTED: 'border-error/40 bg-error-container/50 text-error',
}

export function VerificationBadge({ status }: { status: VerificationStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${styles[status]}`}
    >
      <span className="material-symbols-outlined text-sm">verified</span>
      {labels[status]}
    </span>
  )
}