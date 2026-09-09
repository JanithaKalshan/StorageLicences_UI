export interface ApiError {
  code: string
  description: string
}

export interface ApiErrorResponse {
  errors: ApiError[]
}
