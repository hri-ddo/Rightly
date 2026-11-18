import { useCallback, useMemo, type FormEvent, type ReactNode } from 'react'
import { useSearchParams } from 'react-router-dom'
import { directoryService } from '../services/directoryService'
import { dashboardService } from '../services/dashboardService'
import type { Role } from '../types/api'
import { ProfessionalCard } from '../components/ProfessionalCard'
import { Button } from '../components/ui/Button'
import { Input, Label, Select } from '../components/ui/Input'
import { EmptyState, ErrorState, LoadingBlock } from '../components/ui/PageStates'
import { useAsyncResource } from '../hooks/useAsyncResource'

export function DirectoryView() {
  const [params, setSearchParams] = useSearchParams()

  const role = (params.get('role') as Role | null) ?? undefined
  const district = params.get('district') ?? ''
  const specialty = params.get('specialty') ?? ''
  const language = params.get('language') ?? ''
  const maxFee = params.get('maxFee') ?? ''
  const page = Number(params.get('page') ?? '0')

  const queryKey = useMemo(
    () => [role, district, specialty, language, maxFee, page],
    [role, district, specialty, language, maxFee, page],
  )

  const fetchDirectory = useCallback(
    () =>
      directoryService.search({
        role,
        district: district || undefined,
        specialty: specialty || undefined,
        language: language || undefined,
        maxFee: maxFee ? Number(maxFee) : undefined,
        page,
        size: 12,
      }),
    [role, district, specialty, language, maxFee, page],
  )

  const fetchSummary = useCallback(() => dashboardService.summary(), [])

  const directory = useAsyncResource(fetchDirectory, queryKey)
  const summary = useAsyncResource(fetchSummary)

  const onFilter = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const fd = new FormData(event.currentTarget)
    const next = new URLSearchParams()
    const r = fd.get('role') as string
    if (r) next.set('role', r)
    const d = (fd.get('district') as string).trim()
    if (d) next.set('district', d)
    const s = (fd.get('specialty') as string).trim()
    if (s) next.set('specialty', s)
    const l = (fd.get('language') as string).trim()
    if (l) next.set('language', l)
    const f = (fd.get('maxFee') as string).trim()
    if (f) next.set('maxFee', f)
    next.set('page', '0')
    setSearchParams(next)
  }

  const setRoleTab = (nextRole: Role | '') => {
    const next = new URLSearchParams(params)
    if (nextRole) next.set('role', nextRole)
    else next.delete('role')
    next.set('page', '0')
    setSearchParams(next)
  }

  return (
    <div className="w-full pb-16">
      <header className="mx-auto max-w-7xl px-4 pt-10 lg:px-12">
        <h1 className="font-display text-3xl text-ink lg:text-4xl">Find the right professional</h1>
        <p className="mt-3 max-w-2xl text-sm text-on-surface-variant">
          Every listing is fetched from PostgreSQL. Narrow advocates and clinicians by district, specialty, fee, and
          language.
        </p>
      </header>

      <div className="mx-auto mt-8 flex max-w-7xl flex-wrap items-center gap-2 px-4 lg:px-12" role="tablist" aria-label="Professional type">
        <RoleTab active={!role} onClick={() => setRoleTab('')} label="All" count={summary.data?.totalProfessionals} loading={summary.loading} />
        <RoleTab
          active={role === 'LAWYER'}
          onClick={() => setRoleTab('LAWYER')}
          label="Lawyers"
          count={summary.data?.lawyersCount}
          loading={summary.loading}
        />
        <RoleTab
          active={role === 'PSYCHIATRIST'}
          onClick={() => setRoleTab('PSYCHIATRIST')}
          label="Psychiatrists"
          count={summary.data?.psychiatristsCount}
          loading={summary.loading}
        />
        {summary.error ? (
          <span className="text-xs text-error">
            Counts unavailable —{' '}
            <button type="button" className="underline" onClick={summary.retry}>
              retry
            </button>
          </span>
        ) : null}
      </div>

      <div className="mx-auto mt-10 grid max-w-7xl gap-8 px-4 lg:grid-cols-12 lg:gap-10 lg:px-12">
        <aside className="lg:col-span-4">
          <form className="archive-panel space-y-4 p-5" onSubmit={onFilter}>
            <h2 className="font-display text-lg text-ink">Filters</h2>
            <Field>
              <Label htmlFor="role">Role</Label>
              <Select id="role" name="role" defaultValue={role ?? ''}>
                <option value="">All professionals</option>
                <option value="LAWYER">Lawyer</option>
                <option value="PSYCHIATRIST">Psychiatrist</option>
              </Select>
            </Field>
            <Field>
              <Label htmlFor="district">District</Label>
              <Input id="district" name="district" defaultValue={district} placeholder="Dhaka, Chattogram…" />
            </Field>
            <Field>
              <Label htmlFor="specialty">Specialty</Label>
              <Input id="specialty" name="specialty" defaultValue={specialty} />
            </Field>
            <Field>
              <Label htmlFor="language">Language</Label>
              <Input id="language" name="language" defaultValue={language} placeholder="Bangla, English…" />
            </Field>
            <Field>
              <Label htmlFor="maxFee">Max fee (BDT)</Label>
              <Input id="maxFee" name="maxFee" type="number" min={0} defaultValue={maxFee} />
            </Field>
            <Button type="submit" className="w-full">
              Apply filters
            </Button>
          </form>
        </aside>

        <section className="lg:col-span-8">
          <div className="archive-panel min-h-[12rem] px-6 py-5">
            <h2 className="font-display text-lg text-ink">Results registry</h2>

            {directory.loading ? (
              <div className="mt-6">
                <LoadingBlock label="Loading directory" />
              </div>
            ) : null}
            {directory.error ? (
              <div className="mt-6">
                <ErrorState message={directory.error} onRetry={directory.retry} />
              </div>
            ) : null}
            {!directory.loading && !directory.error && directory.data?.items.length === 0 ? (
              <div className="mt-6">
                <EmptyState
                  title="No professionals match"
                  description="Clear filters or wait for professionals to publish profiles."
                />
              </div>
            ) : null}

            {!directory.loading && !directory.error && directory.data && directory.data.items.length > 0 ? (
              <>
                <p className="mt-2 text-sm text-on-surface-variant">
                  {directory.data.items.length} of {directory.data.totalElements} on this page
                </p>
                <div className="mt-4">
                  {directory.data.items.map((item) => (
                    <ProfessionalCard key={item.id} profile={item} />
                  ))}
                </div>
                <PagerFooter page={page} params={params} setSearchParams={setSearchParams} directory={directory} />
              </>
            ) : null}
          </div>
        </section>
      </div>
    </div>
  )
}

function Field({ children }: { children: ReactNode }) {
  return <div>{children}</div>
}

function RoleTab({
  active,
  onClick,
  label,
  count,
  loading,
}: {
  active: boolean
  onClick: () => void
  label: string
  count?: number
  loading: boolean
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`rounded-default border px-4 py-2 text-sm font-medium transition-colors ${
        active
          ? 'border-ink bg-inverse-surface text-inverse-on-surface'
          : 'border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:border-outline hover:text-on-surface'
      }`}
    >
      {label}
      {!loading && count !== undefined ? <span className="ml-2 tabular-nums text-xs opacity-80">{count}</span> : null}
    </button>
  )
}

function PagerFooter({
  page,
  params,
  setSearchParams,
  directory,
}: {
  page: number
  params: URLSearchParams
  setSearchParams: (p: URLSearchParams) => void
  directory: ReturnType<typeof useAsyncResource<Awaited<ReturnType<typeof directoryService.search>>>>
}) {
  return (
    <div className="section-rule mt-6 flex justify-end gap-3 pt-6">
      <Button
        type="button"
        variant="outline"
        disabled={page <= 0}
        onClick={() => {
          const next = new URLSearchParams(params)
          next.set('page', String(page - 1))
          setSearchParams(next)
        }}
      >
        Previous
      </Button>
      <Button
        type="button"
        variant="outline"
        disabled={!directory.data || (page + 1) * directory.data.size >= directory.data.totalElements}
        onClick={() => {
          const next = new URLSearchParams(params)
          next.set('page', String(page + 1))
          setSearchParams(next)
        }}
      >
        Next
      </Button>
    </div>
  )
}