import { apiClient } from './apiClient'

export const verificationService = {
  async uploadNid(file: File): Promise<void> {
    const form = new FormData()
    form.append('file', file)
    await apiClient.post('/verification/nid', form)
  },

  async uploadSelfie(file: File): Promise<void> {
    const form = new FormData()
    form.append('file', file)
    await apiClient.post('/verification/selfie', form)
  },
}