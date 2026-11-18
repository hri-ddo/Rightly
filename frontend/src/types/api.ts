export type Role = 'USER' | 'LAWYER' | 'PSYCHIATRIST'

export type VerificationStatus = 'UNVERIFIED' | 'PENDING' | 'VERIFIED' | 'REJECTED'

export interface UserResponse {
  id: string
  fullName: string
  email: string | null
  phone: string | null
  role: Role
  verificationStatus: VerificationStatus
  verified: boolean
  createdAt: string
}

export interface AuthSessionResult {
  user: UserResponse
}

export interface DashboardSummaryResponse {
  totalProfessionals: number
  lawyersCount: number
  psychiatristsCount: number
  verifiedUsersCount: number
  verificationStatus: VerificationStatus | null
}

export interface ProfessionalProfileResponse {
  id: string
  userId: string
  displayName: string
  district: string
  specialty: string
  feeBdt: number
  languages: string
  bio: string | null
  role: Role
}

export interface DirectoryPageResponse {
  items: ProfessionalProfileResponse[]
  page: number
  size: number
  totalElements: number
}

export interface RegisterRequest {
  role: Role
  fullName: string
  email?: string
  phone?: string
}

export interface OtpContactRequest {
  email?: string
  phone?: string
}

export interface ProfileUpdateRequest {
  displayName: string
  district: string
  specialty: string
  feeBdt: number
  languages: string
  bio?: string
}

export interface ApiErrorBody {
  message?: string
}

export interface DirectoryQuery {
  role?: Role
  district?: string
  specialty?: string
  maxFee?: number
  language?: string
  page?: number
  size?: number
}