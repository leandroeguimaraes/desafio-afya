export const JWTTOKEN_SERVICE = 'JWTTOKEN SERVICE';

export interface IJwtTokenService {
  sign(obj: object, expiresIn: string | number): any;
  decode(token: string): any;
  verify(token: string): any;
}
