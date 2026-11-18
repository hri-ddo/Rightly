import type { ProfessionalProfileResponse, ProfileUpdateRequest } from '../types/api'
import { apiClient } from './apiClient'

export const profileService = {
  async updateMe(body: ProfileUpdateRequest): Promise<ProfessionalProfileResponse> {
    const { data } = await apiClient.put<ProfessionalProfileResponse>('/profiles/me', body)
    return data
  },
}