import { useEffect, useState, type FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { authService } from '../services/authService'
import { useAuth } from '../context/AuthContext'
import { formatApiError } from '../utils/formatError'
import { Alert } from '../components/ui/Alert'
import { Button } from '../components/ui/Button'
import { Input, Label } from '../components/ui/Input'

type LocationState = {
  email?: string
  phone?: string
  mode?: 'register' | 'login'
  otpSent?: boolean
}

export function OtpVerificationView() {
  const navigate = useNavigate()
  const location = useLocation()
  const state = (location.state as LocationState & { from?: string } | null) ?? {}
  const isLogin = location.pathname === '/login'
  const { setUser } = useAuth()

  const [email, setEmail] = useState(state.email ?? '')
  const [phone, setPhone] = useState(state.phone ?? '')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(Boolean(state.otpSent))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)

  const deliveryHint =
    import.meta.env.DEV && email.trim()
      ? 'Local dev: open Mailpit at http://localhost:8025 — codes are not delivered to your real inbox.'
      : import.meta.env.DEV && phone.trim() && !email.trim()
        ? 'Local dev: SMS is only logged in the backend terminal (no real text message).'
        : null

  useEffect(() => {
    if (!email && !phone && !state.email && !state.phone) {
      setInfo('Enter the email or phone you used when registering.')
    }
  }, [email, phone, state.email, state.phone])

  const requestOtp = async () => {
    setError(null)
    if (!email.trim() && !phone.trim()) {
      setError('Enter email or phone to receive a code.')
      return
    }
    setLoading(true)
    try {
      await authService.requestOtp({
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
      })
      setOtpSent(true)
      setInfo(
        deliveryHint ??
          (email.trim()
            ? 'Check your email for a 6-digit code.'
            : 'Check your SMS for a 6-digit code.'),
      )
    } catch (err: unknown) {
      setError(formatApiError(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!state.otpSent) return
    setInfo(
      deliveryHint ??
        (email.trim() ? 'Check your email for a 6-digit code.' : 'Check your SMS for a 6-digit code.'),
    )
  }, [state.otpSent, deliveryHint, email])

  const verify = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const session = await authService.verifyOtp({
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
        otp: otp.trim(),
      })
      setUser(session.user)
      const dest = isLogin || state.mode === 'login' ? state.from ?? '/dashboard' : '/dashboard'
      navigate(dest, { replace: true })
    } catch (err: unknown) {
      setError(formatApiError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12 lg:px-12">
      <h1 className="font-display text-3xl text-on-surface">Verify OTP</h1>
      <p className="mt-2 text-sm text-on-surface-variant">
        One-time passcode login keeps your session on this device only.
      </p>
      {deliveryHint && !otpSent ? (
        <p className="mt-3 text-xs text-on-surface-variant">{deliveryHint}</p>
      ) : null}

      {error ? (
        <div className="mt-6">
          <Alert variant="error">{error}</Alert>
        </div>
      ) : null}
      {info && !error ? (
        <div className="mt-6">
          <Alert>{info}</Alert>
        </div>
      ) : null}

      <div className="mt-8 space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <Button type="button" variant="outline" disabled={loading} onClick={() => void requestOtp()} className="w-full">
          {otpSent ? 'Resend code' : 'Send code'}
        </Button>
      </div>

      {otpSent ? (
        <form className="mt-8 space-y-4" onSubmit={(e) => void verify(e)}>
          <div>
            <Label htmlFor="otp">6-digit code</Label>
            <Input
              id="otp"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Verifying…' : 'Verify & sign in'}
          </Button>
        </form>
      ) : null}
    </div>
  )
}