import { Link } from 'react-router-dom'

export function SiteFooter() {
  return (
    <footer className="mt-auto w-full bg-surface-container-high shadow-[var(--shadow-card)]">
      <div className="mx-auto max-w-7xl px-4 py-10 lg:px-12">
        <div className="grid gap-8 pb-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-3">
            <div>
              <Link to="/" className="inline-flex rounded-default bg-obsidian px-2.5 py-1.5">
                <img src="/rightly-logo.png" alt="Rightly" className="h-8 w-auto object-contain" />
              </Link>
            </div>
            <p className="text-sm text-on-surface-variant">
              Legal advocacy and psychological sanctuary in Bangladesh — mid-century gravitas with modern safety tooling.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Explore</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link className="hover:text-on-surface" to="/directory">
                  Directory
                </Link>
              </li>
              <li>
                <Link className="hover:text-on-surface" to="/verify">
                  Verify identity
                </Link>
              </li>
              <li>
                <Link className="hover:text-on-surface" to="/emergency">
                  Emergency (offline)
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Crisis</p>
            <ul className="mt-3 space-y-2 text-sm text-on-surface-variant">
              <li>
                <a href="tel:999" className="font-semibold text-on-surface hover:underline">
                  999 — National Emergency
                </a>
              </li>
              <li>
                <a href="tel:109" className="font-semibold text-on-surface hover:underline">
                  109 — Women &amp; Children
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Coming soon</p>
            <p className="mt-3 text-sm text-on-surface-variant">
              Messaging, scheduling, community, SOS, and evidence vault arrive in Sprints 2–3.
            </p>
          </div>
        </div>
        <p className="border-t border-outline-variant/50 pt-6 text-center text-xs text-outline">
          © 2026 Rightly Platform · Republic of Bangladesh
        </p>
      </div>
    </footer>
  )
}