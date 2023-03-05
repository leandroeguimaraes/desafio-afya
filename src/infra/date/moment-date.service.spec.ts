import { MomentDateService } from './moment-date.service';

describe('MomentDateService', () => {
  let service: MomentDateService;

  beforeEach(() => {
    service = new MomentDateService();
  });

  describe('currentUTCDate', () => {
    it('should return a Date object', () => {
      const result = service.currentUTCDate();
      expect(result).toBeInstanceOf(Date);
    });
  });

  describe('getUTCDate', () => {
    it('should return the same date in UTC timezone', () => {
      const date = new Date('2023-03-04T00:00:00Z');

      const result = service.getUTCDate(date);

      expect(result).toEqual(date);
    });
  });

  describe('isAfter', () => {
    it('should return true if first date is after second date', () => {
      const date1 = new Date('2022-01-01');
      const date2 = new Date('2021-01-01');
      const result = service.isAfterDay(date1, date2);
      expect(result).toBe(true);
    });

    it('should return false if first date is before second date', () => {
      const date1 = new Date('2021-01-01');
      const date2 = new Date('2022-01-01');
      const result = service.isAfterDay(date1, date2);
      expect(result).toBe(false);
    });

    it('should return false if dates are equal', () => {
      const date1 = new Date('2022-01-01');
      const date2 = new Date('2022-01-01');
      const result = service.isAfterDay(date1, date2);
      expect(result).toBe(false);
    });
  });

  describe('isBefore', () => {
    it('should return true if first date is before second date', () => {
      const date1 = new Date('2021-01-01');
      const date2 = new Date('2022-01-01');
      const result = service.isBeforeDay(date1, date2);
      expect(result).toBe(true);
    });

    it('should return false if first date is after second date', () => {
      const date1 = new Date('2022-01-01');
      const date2 = new Date('2021-01-01');
      const result = service.isBeforeDay(date1, date2);
      expect(result).toBe(false);
    });

    it('should return false if dates are equal', () => {
      const date1 = new Date('2022-01-01');
      const date2 = new Date('2022-01-01');
      const result = service.isBeforeDay(date1, date2);
      expect(result).toBe(false);
    });
  });
});
