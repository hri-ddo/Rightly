import type { DirectoryPageResponse, DirectoryQuery } from '../types/api'
import { apiClient } from './apiClient'

export const directoryService = {
  async search(params: DirectoryQuery): Promise<DirectoryPageResponse> {
    const { data } = await apiClient.get<DirectoryPageResponse>('/directory', { params })
    return data
  },
}