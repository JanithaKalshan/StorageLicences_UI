import type { UnitListQuery, UnitListResponse } from '@/types/unit'
import type { ApiErrorResponse } from '@/types/api'

const API_BASE_URL = 'https://localhost:7089'

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
    throw new Error(await describeError(response))
  }

  return response.json()
}

async function describeError(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as ApiErrorResponse
    if (body.errors?.length) {
      return body.errors.map((error) => error.description).join(' ')
    }
  } catch {
    // response body was not valid JSON; fall back to the status text below
  }
  return `Request failed with status ${response.status}.`
}
