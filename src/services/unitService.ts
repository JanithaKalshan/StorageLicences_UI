import type { UnitDetailDto, UnitListQuery, UnitListResponse } from '@/types/unit'
import type { ApiErrorResponse } from '@/types/api'

const API_BASE_URL = 'https://localhost:7089'

// Carries the HTTP status so callers can distinguish 404s from other failures.
export class ApiRequestError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

export async function getUnits(query: UnitListQuery): Promise<UnitListResponse> {
  const params = new URLSearchParams()
  params.set('page', String(query.page))
  params.set('pageSize', String(query.pageSize))

  if (query.hasActiveLicence !== undefined) {
    params.set('hasActiveLicence', String(query.hasActiveLicence))
  }
  if (query.minRemainingPalletCapacity !== undefined) {
    params.set('minRemainingPalletCapacity', String(query.minRemainingPalletCapacity))
  }
  if (query.minRemainingBoxCapacity !== undefined) {
    params.set('minRemainingBoxCapacity', String(query.minRemainingBoxCapacity))
  }

  const response = await fetch(`${API_BASE_URL}/api/units?${params.toString()}`)

  if (!response.ok) {
    throw await toApiRequestError(response)
  }

  return response.json()
}

export async function getUnit(id: number): Promise<UnitDetailDto> {
  const response = await fetch(`${API_BASE_URL}/api/units/${id}`)

  if (!response.ok) {
    throw await toApiRequestError(response)
  }

  return response.json()
}

async function toApiRequestError(response: Response): Promise<ApiRequestError> {
  let message = `Request failed with status ${response.status}.`
  try {
    const body = (await response.json()) as ApiErrorResponse
    if (body.errors?.length) {
      message = body.errors.map((error) => error.description).join(' ')
    }
  } catch {
    // response body was not valid JSON; fall back to the status text message above
  }
  return new ApiRequestError(message, response.status)
}
