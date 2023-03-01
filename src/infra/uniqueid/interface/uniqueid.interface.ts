export const UNIQUE_ID_SERVICE = 'UNIQUE ID SERVICE';

export interface IUniqueIDService {
  createUniqueId(): Promise<any> | any;
}
