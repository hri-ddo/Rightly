import { Link } from 'react-router-dom'

export function EmergencyView() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 lg:px-12">
      <h1 className="font-display text-3xl text-on-surface">Emergency resources</h1>
      <p className="mt-3 text-sm text-on-surface-variant">
        This page is available offline after you visit once. If you are in immediate danger, call national emergency
        services now.
      </p>
      <ul className="mt-8 space-y-4 rounded-default border border-outline-variant bg-surface-container-lowest p-6">
        <li>
          <a href="tel:999" className="text-lg font-semibold text-on-surface underline">
            999 — National Emergency Service
          </a>
        </li>
        <li>
          <a href="tel:109" className="text-lg font-semibold text-on-surface underline">
            109 — Women &amp; Children Helpline
          </a>
        </li>
        <li>
          <a
            href="https://www.shantibari.org/kaan-pete-roi"
            className="text-base font-medium text-primary hover:underline"
            target="_blank"
            rel="noreferrer noopener"
          >
            Kaan Pete Roi — mental health support
          </a>
        </li>
      </ul>
      <p className="mt-6 text-xs text-outline">
        Use <strong>Quick Exit</strong> in the crisis bar or press Escape three times within two seconds to leave this site
        quickly (you will be taken to Wikipedia).
      </p>
      <Link to="/" className="mt-6 inline-block text-sm font-semibold text-primary hover:underline">
        Return to home
      </Link>
    </div>
  )
}