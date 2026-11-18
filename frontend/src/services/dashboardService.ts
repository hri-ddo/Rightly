import type { DashboardSummaryResponse } from '../types/api'
import { apiClient } from './apiClient'

export const dashboardService = {
  async summary(): Promise<DashboardSummaryResponse> {
    const { data } = await apiClient.get<DashboardSummaryResponse>('/dashboard/summary')
    return data
  },
}