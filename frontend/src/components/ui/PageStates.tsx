import { Button } from './Button'

export function LoadingBlock({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="animate-pulse space-y-3" aria-busy="true" aria-label={label}>
      <div className="h-4 w-2/3 rounded bg-surface-container-high" />
      <div className="h-4 w-full rounded bg-surface-container" />
      <div className="h-4 w-5/6 rounded bg-surface-container" />
    </div>
  )
}

export function StatSkeleton() {
  return <div className="h-10 w-16 animate-pulse rounded bg-surface-container-high" aria-hidden />
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="rounded-default border border-error/40 bg-error-container/40 p-6 text-center">
      <p className="font-display text-lg text-on-surface">We could not load this section</p>
      <p className="mt-2 text-sm text-on-surface-variant">{message}</p>
      {onRetry ? (
        <Button variant="outline" className="mt-4" onClick={onRetry}>
          Try again
        </Button>
      ) : null}
    </div>
  )
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string
  description?: string
  action?: React.ReactNode
}) {
  return (
    <div className="rounded-default border border-dashed border-outline-variant bg-surface-container-low p-8 text-center">
      <p className="font-display text-xl text-on-surface">{title}</p>
      {description ? <p className="mt-2 text-sm text-on-surface-variant">{description}</p> : null}
      {action ? <div className="mt-4 flex justify-center">{action}</div> : null}
    </div>
  )
}