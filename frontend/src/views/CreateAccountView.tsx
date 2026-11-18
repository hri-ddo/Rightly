import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/authService'
import type { Role } from '../types/api'
import { formatApiError } from '../utils/formatError'
import { Alert } from '../components/ui/Alert'
import { Button } from '../components/ui/Button'
import { Input, Label, Select } from '../components/ui/Input'

export function CreateAccountView() {
  const navigate = useNavigate()
  const [role, setRole] = useState<Role>('USER')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    if (!email.trim() && !phone.trim()) {
      setError('Provide an email or phone number.')
      return
    }
    setLoading(true)
    try {
      const trimmedEmail = email.trim() || undefined
      const trimmedPhone = phone.trim() || undefined
      await authService.register({
        role,
        fullName: fullName.trim(),
        email: trimmedEmail,
        phone: trimmedPhone,
      })
      await authService.requestOtp({
        email: trimmedEmail,
        phone: trimmedPhone,
      })
      navigate('/otp', {
        state: {
          email: trimmedEmail,
          phone: trimmedPhone,
          mode: 'register',
          otpSent: true,
        },
      })
    } catch (err: unknown) {
      setError(formatApiError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-12 lg:px-12">
      <h1 className="font-display text-3xl text-ink">Create your account</h1>
      <p className="mt-2 text-sm text-on-surface-variant">Choose your role and contact details. We will verify via OTP.</p>

      {error ? (
        <div className="mt-6">
          <Alert variant="error">{error}</Alert>
        </div>
      ) : null}

      <form className="archive-panel mt-8 space-y-5 p-6" onSubmit={(e) => void onSubmit(e)}>
        <div>
          <Label htmlFor="role">Role</Label>
          <Select id="role" value={role} onChange={(e) => setRole(e.target.value as Role)}>
            <option value="USER">Citizen / client</option>
            <option value="LAWYER">Lawyer</option>
            <option value="PSYCHIATRIST">Psychiatrist</option>
          </Select>
        </div>
        <div>
          <Label htmlFor="fullName">Full name</Label>
          <Input id="fullName" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="phone">Phone (Bangladesh)</Label>
          <Input id="phone" type="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <p className="text-xs text-on-surface-variant">
          For emergencies requiring physical intervention, call <a href="tel:999" className="font-semibold text-error underline">999</a>{' '}
          immediately.
        </p>
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Creating…' : 'Continue to OTP'}
        </Button>
      </form>
    </div>
  )
}