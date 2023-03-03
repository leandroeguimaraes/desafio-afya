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
});
