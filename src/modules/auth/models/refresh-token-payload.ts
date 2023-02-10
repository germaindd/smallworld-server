export interface RefreshTokenPayload {
  sub: string;
  sessionid: string;
  jti: string;
  exp: number;
}
