import type { AuthSessionResult, OtpContactRequest, RegisterRequest, UserResponse } from '../types/api'
import { apiClient } from './apiClient'

type OtpVerifyPayload = { email?: string; phone?: string; otp: string }

export const authService = {
  async register(body: RegisterRequest): Promise<UserResponse> {
    const { data } = await apiClient.post<UserResponse>('/auth/register', body)
    return data
  },

  async requestOtp(body: OtpContactRequest): Promise<void> {
    await apiClient.post('/auth/otp/request', body)
  },

  async verifyOtp(body: OtpVerifyPayload): Promise<AuthSessionResult> {
    const { data } = await apiClient.post<AuthSessionResult>('/auth/otp/verify', body)
    return data
  },

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout')
  },

  async me(): Promise<UserResponse> {
    const { data } = await apiClient.get<UserResponse>('/auth/me')
    return data
  },
}