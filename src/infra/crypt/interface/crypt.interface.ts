export const CRYPT_SERVICE = 'CRYPT SERVICE';

export interface ICryptService {
  createHash(message: string, cost: number): Promise<any> | any;
  compare(data: string, encrypted: string): Promise<any> | any;
}
