import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { profileService } from '../services/profileService'
import { useAuth } from '../context/AuthContext'
import { formatApiError } from '../utils/formatError'
import { RequireAuth } from '../components/RequireAuth'
import { Alert } from '../components/ui/Alert'
import { Button } from '../components/ui/Button'
import { Input, Label, TextArea } from '../components/ui/Input'

function ProfileEditForm() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [displayName, setDisplayName] = useState(user?.fullName ?? '')
  const [district, setDistrict] = useState('')
  const [specialty, setSpecialty] = useState('')
  const [feeBdt, setFeeBdt] = useState(0)
  const [languages, setLanguages] = useState('Bangla, English')
  const [bio, setBio] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  if (user && user.role === 'USER') {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="font-display text-xl">Professional profiles are for lawyers and psychiatrists only.</p>
        <Button type="button" className="mt-4" onClick={() => navigate('/dashboard')}>
          Back to dashboard
        </Button>
      </div>
    )
  }

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    setSuccess(false)
    setLoading(true)
    try {
      await profileService.updateMe({
        displayName: displayName.trim(),
        district: district.trim(),
        specialty: specialty.trim(),
        feeBdt,
        languages: languages.trim(),
        bio: bio.trim() || undefined,
      })
      setSuccess(true)
    } catch (err: unknown) {
      setError(formatApiError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-12 lg:px-12">
      <h1 className="font-display text-3xl text-on-surface">Edit directory profile</h1>
      <p className="mt-2 text-sm text-on-surface-variant">
        This information appears in the public directory after you are verified.
      </p>

      {error ? (
        <div className="mt-6">
          <Alert variant="error">{error}</Alert>
        </div>
      ) : null}
      {success ? (
        <div className="mt-6">
          <Alert>Profile saved.</Alert>
        </div>
      ) : null}

      <form className="mt-8 space-y-4" onSubmit={(e) => void onSubmit(e)}>
        <div>
          <Label htmlFor="displayName">Display name</Label>
          <Input id="displayName" required value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="district">District</Label>
          <Input id="district" required value={district} onChange={(e) => setDistrict(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="specialty">Specialty</Label>
          <Input id="specialty" required value={specialty} onChange={(e) => setSpecialty(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="fee">Consultation fee (BDT)</Label>
          <Input
            id="fee"
            type="number"
            min={0}
            required
            value={feeBdt}
            onChange={(e) => setFeeBdt(Number(e.target.value))}
          />
        </div>
        <div>
          <Label htmlFor="languages">Languages</Label>
          <Input id="languages" required value={languages} onChange={(e) => setLanguages(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="bio">Bio (optional)</Label>
          <TextArea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} />
        </div>
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Saving…' : 'Save profile'}
        </Button>
      </form>
    </div>
  )
}

export function ProfileEditView() {
  return (
    <RequireAuth>
      <ProfileEditForm />
    </RequireAuth>
  )
}