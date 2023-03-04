import { validateSync } from 'class-validator';
import { CreateScheduleDto } from './create-schedule.dto';

describe('CreateScheduleDto', () => {
  it('should validate a valid dto', () => {
    const scheduleDto = new CreateScheduleDto();
    scheduleDto.userId = 1;
    scheduleDto.patientId = 2;
    scheduleDto.date = new Date('2023-03-03');
    const errors = validateSync(scheduleDto);
    expect(errors.length).toBe(0);
  });
  it('should not validate an invalid dto with missing fields', () => {
    const scheduleDto = new CreateScheduleDto();
    scheduleDto.userId = 1;
    const errors = validateSync(scheduleDto);
    expect(errors.length).toBeGreaterThan(0);
  });
  it('should not validate an invalid dto with invalid fields', () => {
    const scheduleDto = new CreateScheduleDto();
    scheduleDto.userId = -1;
    scheduleDto.patientId = -1;
    scheduleDto.date = null;
    const errors = validateSync(scheduleDto);
    expect(errors.length).toBeGreaterThan(0);
  });
  describe('userId', () => {
    it('should not validate an invalid dto with invalid userId', () => {
      const scheduleDto = new CreateScheduleDto();
      scheduleDto.userId = 1;
      scheduleDto.patientId = 2;
      scheduleDto.date = new Date('2023-03-03');

      // Set userId to a non-numeric value
      scheduleDto.userId = 'not a number' as any;

      const errors = validateSync(scheduleDto);
      expect(errors.length).toBe(1);
    });

    it('should not validate an invalid dto with userId less than 1', () => {
      const scheduleDto = new CreateScheduleDto();
      scheduleDto.userId = 1;
      scheduleDto.patientId = 2;
      scheduleDto.date = new Date('2023-03-03');

      // Set userId to a value less than 1
      scheduleDto.userId = 0;

      const errors = validateSync(scheduleDto);
      expect(errors.length).toBe(1);
    });

    it('should validate a valid dto with valid userId', () => {
      const scheduleDto = new CreateScheduleDto();
      scheduleDto.userId = 1;
      scheduleDto.patientId = 2;
      scheduleDto.date = new Date('2023-03-03');

      // Set userId to a valid value
      scheduleDto.userId = 1234;

      const errors = validateSync(scheduleDto);
      expect(errors.length).toBe(0);
    });
  })
  describe('patientId', () => {
    it('should not validate an invalid dto with invalid patientId', () => {
      const scheduleDto = new CreateScheduleDto();
      scheduleDto.userId = 1234;
      scheduleDto.patientId = 0;
      scheduleDto.date = new Date();

      const errors = validateSync(scheduleDto);
      expect(errors.length).toBe(1);

    });

    it('should validate a valid dto with valid patientId', () => {
      const scheduleDto = new CreateScheduleDto();
      scheduleDto.userId = 1234;
      scheduleDto.patientId = 5678;
      scheduleDto.date = new Date();

      const errors = validateSync(scheduleDto);
      expect(errors.length).toBe(0);
      expect(scheduleDto.patientId).toBe(5678);
    });
  });
  describe('date', () => {
    it('should validate a valid date', () => {
      const scheduleDto = new CreateScheduleDto();
      scheduleDto.userId = 1;
      scheduleDto.patientId = 1;
      scheduleDto.date = new Date('2023-04-05T14:30:00.000Z');

      const errors = validateSync(scheduleDto);
      expect(errors.length).toBe(0);
    });

    it('should not validate an empty date', () => {
      const scheduleDto = new CreateScheduleDto();
      scheduleDto.userId = 1;
      scheduleDto.patientId = 1;
      scheduleDto.date = null;

      const errors = validateSync(scheduleDto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should not validate a date with invalid format', () => {
      const scheduleDto = new CreateScheduleDto();
      scheduleDto.userId = 1;
      scheduleDto.patientId = 1;
      scheduleDto.date = 'invalid date' as any;

      const errors = validateSync(scheduleDto);
      expect(errors.length).toBeGreaterThan(0);
    });
  });
});
