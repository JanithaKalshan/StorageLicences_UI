import { API_BASE_URL } from './httpConfig'
import { toApiRequestError } from './unitService'
import type { CreatePlacementRequest, CreatePlacementResponse } from '@/types/placement'

export async function createPlacement(
  request: CreatePlacementRequest,
): Promise<CreatePlacementResponse> {
  const response = await fetch(`${API_BASE_URL}/api/placements`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    throw await toApiRequestError(response)
  }

  return response.json()
}
