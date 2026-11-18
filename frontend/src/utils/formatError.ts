import axios from 'axios'
import type { ApiErrorBody } from '../types/api'

/** Extracts a readable error message from an Axios/API error response or fallback string. */
export function formatApiError(error: unknown, fallback = 'Something went wrong'): string {
  if (axios.isAxiosError<ApiErrorBody>(error)) {
    return error.response?.data?.message ?? error.message ?? fallback
  }
  if (error instanceof Error) return error.message
  return fallback
}