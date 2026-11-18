import { ButtonLink } from '../components/ui/Button'
import { EmptyState } from '../components/ui/PageStates'

export function PlaceholderView({
  title,
  sprint,
  description,
}: {
  title: string
  sprint: string
  description?: string
}) {
  return (
    <div className="mx-auto max-w-xl px-4 py-16 lg:px-12">
      <EmptyState
        title={title}
        description={
          description ??
          `This feature is planned for ${sprint}. Sprint 1 focuses on auth, verification, and the professional directory.`
        }
        action={
          <ButtonLink to="/dashboard" variant="outline">
            Back to dashboard
          </ButtonLink>
        }
      />
    </div>
  )
}