import type { ProfessionalProfileResponse } from '../types/api'

/** Single registry row — docket list, not a floating metric card. */
export function ProfessionalCard({ profile }: { profile: ProfessionalProfileResponse }) {
  const isLawyer = profile.role === 'LAWYER'

  return (
    <article className="border-b border-outline-variant py-6 first:pt-2 last:border-b-0">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h3 className="font-display text-xl text-ink">{profile.displayName}</h3>
            <span
              className={`label-caps rounded-full border px-2 py-0.5 ${
                isLawyer
                  ? 'border-muted-olive bg-surface-container-low text-on-surface-variant'
                  : 'border-success/30 bg-surface-container-lowest text-success'
              }`}
            >
              {isLawyer ? 'Advocate' : 'Psychiatrist'}
            </span>
          </div>
          <p className="mt-1 text-sm font-medium text-on-surface">{profile.specialty}</p>
          {profile.bio ? (
            <p className="mt-3 max-w-[52ch] text-sm leading-relaxed text-on-surface-variant">{profile.bio}</p>
          ) : null}
        </div>

        <dl className="grid shrink-0 grid-cols-2 gap-x-6 gap-y-2 text-sm sm:text-right">
          <div>
            <dt className="label-caps">District</dt>
            <dd className="font-medium text-ink">{profile.district}</dd>
          </div>
          <div>
            <dt className="label-caps">Fee (BDT)</dt>
            <dd className="font-medium tabular-nums text-ink">৳{profile.feeBdt.toLocaleString()}</dd>
          </div>
          <div className="col-span-2 sm:col-span-2">
            <dt className="label-caps">Languages</dt>
            <dd className="text-on-surface-variant">{profile.languages}</dd>
          </div>
        </dl>
      </div>
    </article>
  )
}