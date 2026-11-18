import { useRef, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { verificationService } from '../services/verificationService'
import { useAuth } from '../context/AuthContext'
import { formatApiError } from '../utils/formatError'
import { Alert } from '../components/ui/Alert'
import { Button } from '../components/ui/Button'
import { Label } from '../components/ui/Input'
import { RequireAuth } from '../components/RequireAuth'

function VerifyForm() {
  const { refresh } = useAuth()
  const navigate = useNavigate()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [nidFile, setNidFile] = useState<File | null>(null)
  const [selfieFile, setSelfieFile] = useState<File | null>(null)
  const [cameraOn, setCameraOn] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [step, setStep] = useState<'nid' | 'selfie' | 'done'>('nid')
  const [message, setMessage] = useState<string | null>(null)

  const startCamera = async () => {
    setError(null)
    try {
      const media = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })
      setStream(media)
      setCameraOn(true)
      if (videoRef.current) {
        videoRef.current.srcObject = media
        await videoRef.current.play()
      }
    } catch {
      setError('Camera unavailable. Use file upload instead.')
    }
  }

  const stopCamera = () => {
    stream?.getTracks().forEach((t) => t.stop())
    setStream(null)
    setCameraOn(false)
  }

  const captureSelfie = async () => {
    const video = videoRef.current
    if (!video) return
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.drawImage(video, 0, 0)
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.92))
    if (!blob) return
    setSelfieFile(new File([blob], 'selfie.jpg', { type: 'image/jpeg' }))
    stopCamera()
  }

  const submitNid = async (event: FormEvent) => {
    event.preventDefault()
    if (!nidFile) {
      setError('Select your NID scan or photo.')
      return
    }
    setLoading(true)
    setError(null)
    try {
      await verificationService.uploadNid(nidFile)
      setStep('selfie')
      setMessage('NID received. Add a live selfie or upload a photo.')
    } catch (err: unknown) {
      setError(formatApiError(err))
    } finally {
      setLoading(false)
    }
  }

  const submitSelfie = async (event: FormEvent) => {
    event.preventDefault()
    if (!selfieFile) {
      setError('Capture or upload a selfie.')
      return
    }
    setLoading(true)
    setError(null)
    try {
      await verificationService.uploadSelfie(selfieFile)
      await refresh()
      setStep('done')
      setMessage('Documents submitted. Verification status will update after review.')
    } catch (err: unknown) {
      setError(formatApiError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-12 lg:px-12">
      <h1 className="font-display text-3xl text-on-surface">Identity verification</h1>
      <p className="mt-2 text-sm text-on-surface-variant">
        Upload your National ID and a selfie. Files are stored securely for manual review.
      </p>

      {error ? (
        <div className="mt-6">
          <Alert variant="error">{error}</Alert>
        </div>
      ) : null}
      {message ? (
        <div className="mt-6">
          <Alert>{message}</Alert>
        </div>
      ) : null}

      {step === 'nid' ? (
        <form className="mt-8 space-y-4" onSubmit={(e) => void submitNid(e)}>
          <Label htmlFor="nid">NID image (JPEG or PNG)</Label>
          <input
            id="nid"
            type="file"
            accept="image/*"
            className="block w-full text-sm"
            onChange={(e) => setNidFile(e.target.files?.[0] ?? null)}
          />
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Uploading…' : 'Upload NID'}
          </Button>
        </form>
      ) : null}

      {step === 'selfie' ? (
        <form className="mt-8 space-y-4" onSubmit={(e) => void submitSelfie(e)}>
          <div className="space-y-3 rounded-default border border-outline-variant bg-surface-container-low p-4">
            {!cameraOn ? (
              <Button type="button" variant="outline" onClick={() => void startCamera()}>
                Open camera
              </Button>
            ) : (
              <div className="space-y-2">
                <video ref={videoRef} className="aspect-video w-full rounded-default bg-inverse-surface/10" muted playsInline />
                <div className="flex gap-2">
                  <Button type="button" onClick={() => void captureSelfie()}>
                    Capture selfie
                  </Button>
                  <Button type="button" variant="outline" onClick={stopCamera}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
            <div>
              <Label htmlFor="selfie-file">Or upload selfie</Label>
              <input
                id="selfie-file"
                type="file"
                accept="image/*"
                capture="user"
                className="block w-full text-sm"
                onChange={(e) => setSelfieFile(e.target.files?.[0] ?? null)}
              />
            </div>
            {selfieFile ? (
              <p className="text-xs text-on-surface-variant">Selected: {selfieFile.name}</p>
            ) : null}
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Submitting…' : 'Submit selfie'}
          </Button>
        </form>
      ) : null}

      {step === 'done' ? (
        <div className="mt-8">
          <Button type="button" onClick={() => navigate('/dashboard')}>
            Go to dashboard
          </Button>
        </div>
      ) : null}
    </div>
  )
}

export function VerifyView() {
  return (
    <RequireAuth>
      <VerifyForm />
    </RequireAuth>
  )
}