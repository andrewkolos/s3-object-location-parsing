export type ParseResult<T> = ParseSuccessResult<T> | ParseFailureResult

export interface ParseSuccessResult<T> {
  success: boolean
  value: T
}

export interface ParseFailureResult {
  success: false
}
