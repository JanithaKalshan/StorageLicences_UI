export interface UnitListItemDto {
  id: number
  palletCapacity: number
  boxCapacity: number
  occupiedPalletCount: number
  occupiedBoxCount: number
  remainingPalletCapacity: number
  remainingBoxCapacity: number
  hasActiveLicence: boolean
}

export interface UnitListResponse {
  items: UnitListItemDto[]
  totalCount: number
  page: number
  pageSize: number
}

export interface UnitListQuery {
  page: number
  pageSize: number
  hasActiveLicence?: boolean
  minRemainingPalletCapacity?: number
  minRemainingBoxCapacity?: number
}
