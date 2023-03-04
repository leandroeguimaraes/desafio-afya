import { validateSync } from 'class-validator';
import { UpdateScheduleDto } from './update-schedule.dto';

describe('UpdateScheduleDto', () => {
  it('should validate a valid dto', () => {
    const dto = new UpdateScheduleDto();
    dto.userId = 1;
    dto.patientId = 2;
    dto.date = new Date('2020-01-01');

    const errors = validateSync(dto);
    expect(errors.length).toBe(0);
  });

  it('should validate an valid dto with valid userId', () => {
    const dto = new UpdateScheduleDto();
    dto.userId = 1;

    const errors = validateSync(dto);
    expect(errors.length).toBe(0);
  });

  it('should validate an valid dto with valid patientId', () => {
    const dto = new UpdateScheduleDto();
    dto.patientId = 1;

    const errors = validateSync(dto);
    expect(errors.length).toBe(0);
  });

  it('should not validate an invalid dto with invalid date', () => {
    const dto = new UpdateScheduleDto();
    dto.date = new Date('invalid date');

    const errors = validateSync(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
