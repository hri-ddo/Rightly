import { useCallback } from 'react'
import { Link } from 'react-router-dom'
import { dashboardService } from '../services/dashboardService'
import { ButtonLink } from '../components/ui/Button'
import { Alert } from '../components/ui/Alert'
import { useAsyncResource } from '../hooks/useAsyncResource'

export function HomeView() {
  const fetchSummary = useCallback(() => dashboardService.summary(), [])
  const { data, loading, error, retry } = useAsyncResource(fetchSummary)

  return (
    <section className="w-full">
      <div className="border-b border-parchment-border bg-surface-container-low py-10 lg:py-14">
        <div className="mx-auto grid max-w-7xl items-start gap-12 px-4 lg:grid-cols-12 lg:gap-14 lg:px-12">
          <div className="lg:col-span-7">
            <h1 className="font-display text-3xl leading-tight tracking-tight text-ink lg:text-5xl lg:tracking-tighter">
              Your rights, your voice, and a{' '}
              <span className="border-b-2 border-brand-crimson pb-0.5">clear path forward</span> in Bangladesh.
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-on-surface-variant">
              Rightly helps verified citizens understand what applies to their situation, connect with lawyers or
              psychiatrists, and move forward without navigating a cold bureaucratic interface.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <ButtonLink to="/directory">Find a professional</ButtonLink>
              <ButtonLink to="/register" variant="secondary">
                Create account
              </ButtonLink>
            </div>
          </div>

          <aside className="lg:col-span-5">
            <div className="archive-panel p-6 lg:p-7">
              <h2 className="font-display text-xl text-ink">Directory register</h2>
              <p className="mt-2 text-sm text-on-surface-variant">
                Counts below are loaded from the live database — not marketing placeholders.
              </p>

              {error ? (
                <div className="mt-4">
                  <Alert variant="error" title="Could not load register">
                    {error}
                    <button type="button" className="ml-2 font-semibold underline" onClick={retry}>
                      Retry
                    </button>
                  </Alert>
                </div>
              ) : null}

              <dl className="mt-6 space-y-0 border-y border-outline-variant">
                <RegisterRow label="Advocates listed" loading={loading} value={data?.lawyersCount} />
                <RegisterRow label="Psychiatrists listed" loading={loading} value={data?.psychiatristsCount} />
                <RegisterRow label="Verified members" loading={loading} value={data?.verifiedUsersCount} />
              </dl>

              {!loading && !error && data && data.lawyersCount === 0 && data.psychiatristsCount === 0 ? (
                <p className="mt-4 text-sm text-on-surface-variant">
                  No published profiles yet. Start Docker and the API to load seeded professionals.
                </p>
              ) : (
                <p className="mt-4 text-sm text-on-surface-variant">
                  <Link to="/directory" className="font-medium text-ink underline decoration-outline-variant underline-offset-2">
                    Open the full directory
                  </Link>{' '}
                  to filter by district, specialty, and fee.
                </p>
              )}
            </div>
          </aside>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-14 lg:px-12">
        <HowItWorksSections />
      </div>
    </section>
  )
}

function RegisterRow({
  label,
  value,
  loading,
}: {
  label: string
  value?: number
  loading: boolean
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-outline-variant/60 py-4 last:border-b-0">
      <dt className="text-sm text-on-surface-variant">{label}</dt>
      <dd className="font-display text-2xl tabular-nums text-ink">
        {loading ? <span className="inline-block h-7 w-10 animate-pulse rounded bg-surface-container-high" /> : (value ?? '—')}
      </dd>
    </div>
  )
}

/** Editorial three-column explainer — prose blocks, not icon cards (craft-floor). */
function HowItWorksSections() {
  return (
    <div className="grid gap-10 lg:grid-cols-3 lg:gap-12">
      <article>
        <h2 className="font-display text-2xl text-ink">Verify once</h2>
        <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">
          Register with email or phone, confirm a one-time code, then upload your NID and a selfie. Verification unlocks
          directory messaging and safety tools in later sprints.
        </p>
      </article>
      <article>
        <h2 className="font-display text-2xl text-ink">Find the right professional</h2>
        <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">
          Lawyers and psychiatrists maintain their own profiles. Every card you see in the directory is a row returned
          from PostgreSQL — filtered by role, district, and specialty.
        </p>
      </article>
      <article>
        <h2 className="font-display text-2xl text-ink">Safety built in</h2>
        <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">
          Emergency numbers stay visible on every page. Quick Exit leaves the site immediately. The{' '}
          <Link to="/emergency" className="text-ink underline">
            emergency page
          </Link>{' '}
          is cached for offline access.
        </p>
      </article>
    </div>
  )
}