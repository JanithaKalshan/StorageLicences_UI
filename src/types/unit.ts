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

export interface LicenceDto {
  id: number
  grantDate: string
  termYears: string
  coverageEndDateExclusive: string
  surrenderedDate: string | ''
  holderId: string
}

export interface PlacementDto {
  id: number
  itemId: number
  placementClass: string
  scheduledDate: string
  status: string
}

export interface UnitDetailDto {
  id: number
  palletCapacity: number
  boxCapacity: number
  occupiedPalletCount: number
  occupiedBoxCount: number
  remainingPalletCapacity: number
  remainingBoxCapacity: number
  licences: LicenceDto[] | null
  licenceHistory: LicenceDto[]
  placements: PlacementDto[]
}
