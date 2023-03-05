export const DATE_SERVICE = 'DATE SERVICE';

export interface IDateService {
  currentUTCDate(): Date;
  getUTCDate(date: Date): Date;
  isAfterDay(
    date: number | Date,
    dateToCompare: number | Date,
  ): Promise<boolean> | boolean;
  isBeforeDay(
    date: number | Date,
    dateToCompare: number | Date,
  ): Promise<boolean> | boolean;
}
