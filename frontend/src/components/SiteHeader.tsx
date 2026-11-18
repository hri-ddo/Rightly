import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ButtonLink } from './ui/Button'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `border-b-2 py-1 text-sm font-medium transition-colors ${
    isActive
      ? 'border-primary-container text-inverse-on-surface font-semibold'
      : 'border-transparent text-inverse-on-surface/75 hover:text-inverse-on-surface'
  }`

export function SiteHeader() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const onLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <header className="w-full border-b-2 border-brand-crimson/80 bg-obsidian text-inverse-on-surface">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 lg:px-12">
        <NavLink to="/" className="flex items-center gap-3 focus-visible:outline-primary-container">
          <img
            src="/rightly-logo.png"
            alt="Rightly — Legal & Mental Health Support"
            className="h-10 w-auto object-contain"
          />
        </NavLink>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary">
          <NavLink to="/" className={linkClass} end>
            Home
          </NavLink>
          <NavLink to="/directory?role=LAWYER" className={linkClass}>
            Find a Lawyer
          </NavLink>
          <NavLink to="/directory?role=PSYCHIATRIST" className={linkClass}>
            Find a Psychiatrist
          </NavLink>
          <NavLink to="/dashboard" className={linkClass}>
            Dashboard
          </NavLink>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="hidden max-w-[8rem] truncate text-sm text-inverse-on-surface/80 sm:inline">
                {user.fullName}
              </span>
              <LinkButtonToDashboard />
              <button
                type="button"
                onClick={() => void onLogout()}
                className="text-sm text-inverse-on-surface/80 hover:text-primary-container"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className="hidden px-3 py-2 text-sm font-medium text-inverse-on-surface/85 hover:text-primary-container sm:inline"
              >
                Log In
              </NavLink>
              <ButtonLink to="/register">Get Started</ButtonLink>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

function LinkButtonToDashboard() {
  return (
    <NavLink
      to="/dashboard"
      className="hidden rounded-default border border-inverse-on-surface/30 px-3 py-1.5 text-sm font-semibold text-inverse-on-surface transition-colors hover:border-primary-container hover:text-primary-container sm:inline-flex"
    >
      Dashboard
    </NavLink>
  )
}