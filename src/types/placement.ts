export interface CreatePlacementRequest {
  unitId: number
  itemId: number
  placementClass: 'Pallet' | 'Box'
  scheduledDate: string
  assertedRequesterId: string
}

export interface CreatePlacementResponse {
  id: number
  unitId: number
  itemId: number
  placementClass: string
  scheduledDate: string
  status: string
}
