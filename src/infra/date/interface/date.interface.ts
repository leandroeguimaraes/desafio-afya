export const DATE_SERVICE = 'DATE SERVICE';

export interface IDateService {
  currentUTCDate(): Date;
  getUTCDate(date: Date): Date;
  isAfter(
    date: number | Date,
    dateToCompare: number | Date,
  ): Promise<boolean> | boolean;
  isBefore(
    date: number | Date,
    dateToCompare: number | Date,
  ): Promise<boolean> | boolean;
}
