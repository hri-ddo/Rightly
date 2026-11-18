import axios from 'axios'
import { getCookie } from '../utils/cookies'

const CSRF_COOKIE = 'RIGHTLY_CSRF'

const baseURL = import.meta.env.VITE_API_URL ?? 'http://localhost:8081/api'

/**
 * Shared Axios client for Spring Boot APIs.
 * Sends HttpOnly session cookies (withCredentials) and attaches X-CSRF-Token on mutating calls.
 */
export const apiClient = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    Accept: 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const method = config.method?.toLowerCase()
  if (method && ['post', 'put', 'patch', 'delete'].includes(method)) {
    const token = getCookie(CSRF_COOKIE)
    if (token) {
      config.headers.set('X-CSRF-Token', token)
    }
  }
  return config
})