export interface IAuth {
  accessToken?: string
  refreshToken?: string
  sessionToken?: string
}
export interface JwtPayload {
  id: number
  email: string
  role: string
}
