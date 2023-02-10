export interface RefreshTokenPayload {
  username: string;
  sub: string;
  sessionid: string;
  jti: string;
  exp: number;
}
