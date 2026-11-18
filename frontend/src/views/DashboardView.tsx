import { useCallback } from 'react'
import { Link } from 'react-router-dom'
import { dashboardService } from '../services/dashboardService'
import { useAuth } from '../context/AuthContext'
import { VerificationBadge } from '../components/VerificationBadge'
import { RequireAuth } from '../components/RequireAuth'
import { ButtonLink } from '../components/ui/Button'
import { ErrorState, LoadingBlock, StatSkeleton } from '../components/ui/PageStates'
import { useAsyncResource } from '../hooks/useAsyncResource'

function DashboardContent() {
  const { user } = useAuth()
  const fetchSummary = useCallback(() => dashboardService.summary(), [])
  const summary = useAsyncResource(fetchSummary)

  if (!user) return null

  const isProfessional = user.role === 'LAWYER' || user.role === 'PSYCHIATRIST'

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 lg:px-12">
      <h1 className="font-display text-4xl text-ink">Your dashboard</h1>
      <p className="mt-2 text-on-surface-variant">Session and directory figures from the live API.</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <section className="archive-panel p-6 lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-2xl text-ink">{user.fullName}</h2>
              <p className="text-sm text-on-surface-variant">{user.email ?? user.phone ?? 'No contact on file'}</p>
            </div>
            <VerificationBadge status={user.verificationStatus} />
          </div>
          <dl className="mt-6 grid gap-4 sm:grid-cols-2 text-sm">
            <div>
              <dt className="label-caps">Role</dt>
              <dd className="font-medium">{user.role.replace('_', ' ')}</dd>
            </div>
            <div>
              <dt className="label-caps">Member since</dt>
              <dd className="font-medium">{new Date(user.createdAt).toLocaleDateString()}</dd>
            </div>
          </dl>
          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink to="/verify" variant="outline">
              {user.verificationStatus === 'VERIFIED' ? 'View verification' : 'Complete verification'}
            </ButtonLink>
            {isProfessional ? (
              <ButtonLink to="/profile/edit">Edit public profile</ButtonLink>
            ) : null}
          </div>
        </section>

        <section className="archive-panel-muted p-6">
          <h2 className="label-caps text-on-surface-variant">Platform directory</h2>
          {summary.loading ? <LoadingBlock /> : null}
          {summary.error ? <ErrorState message={summary.error} onRetry={summary.retry} /> : null}
          {summary.data ? (
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex justify-between">
                <span>Total professionals</span>
                {summary.loading ? <StatSkeleton /> : <strong>{summary.data.totalProfessionals}</strong>}
              </li>
              <li className="flex justify-between">
                <span>Lawyers</span>
                <strong>{summary.data.lawyersCount}</strong>
              </li>
              <li className="flex justify-between">
                <span>Psychiatrists</span>
                <strong>{summary.data.psychiatristsCount}</strong>
              </li>
            </ul>
          ) : null}
        </section>
      </div>

      <section className="mt-10 section-rule pt-8">
        <h2 className="font-display text-xl text-ink">Workspace</h2>
        <ul className="mt-4 space-y-2 text-sm">
          <li>
            <Link className="font-medium text-ink underline decoration-outline-variant underline-offset-2" to="/directory">
              Professional directory
            </Link>
            <span className="text-on-surface-variant"> — filter and browse live listings</span>
          </li>
          <li>
            <Link className="font-medium text-ink underline decoration-outline-variant underline-offset-2" to="/emergency">
              Emergency page
            </Link>
            <span className="text-on-surface-variant"> — offline hotlines</span>
          </li>
        </ul>
      </section>

      <section className="mt-10 border border-dashed border-outline-variant bg-surface-container-low/40 p-6">
        <h2 className="label-caps text-on-surface-variant">Later sprints</h2>
        <p className="mt-2 text-sm text-on-surface-variant">
          Messaging, video calls, community, SOS alerts, and evidence vault are not available yet — no placeholder counts
          are shown here.
        </p>
        <ul className="mt-4 flex flex-wrap gap-2 text-xs">
          {[
            { to: '/assistant', label: 'AI assistant' },
            { to: '/community', label: 'Community' },
            { to: '/sos', label: 'SOS' },
            { to: '/vault', label: 'Evidence vault' },
          ].map((item) => (
            <li key={item.to}>
              <Link className="rounded-full border border-outline-variant px-3 py-1 hover:bg-surface-container-lowest" to={item.to}>
                {item.label} — not available yet
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

export function DashboardView() {
  return (
    <RequireAuth>
      <DashboardContent />
    </RequireAuth>
  )
}