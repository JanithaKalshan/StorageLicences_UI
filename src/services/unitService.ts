import type { UnitDetailDto, UnitListQuery, UnitListResponse } from '@/types/unit'
import type { ApiError, ApiErrorResponse } from '@/types/api'
import { API_BASE_URL } from './httpConfig'

// Carries the HTTP status and structured errors so callers can distinguish
// 404s and display individual validation failures.
export class ApiRequestError extends Error {
  status: number
  errors?: ApiError[]

  constructor(message: string, status: number, errors?: ApiError[]) {
    super(message)
    this.status = status
    this.errors = errors
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

export async function toApiRequestError(response: Response): Promise<ApiRequestError> {
  let message = `Request failed with status ${response.status}.`
  let errors: ApiError[] | undefined
  try {
    const body = (await response.json()) as ApiErrorResponse
    if (body.errors?.length) {
      errors = body.errors
      message = body.errors.map((error) => error.description).join(' ')
    }
  } catch {
    // response body was not valid JSON; fall back to the status text message above
  }
  return new ApiRequestError(message, response.status, errors)
}
