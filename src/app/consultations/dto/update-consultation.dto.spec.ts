import { validateSync } from 'class-validator';
import { UpdateConsultationDto } from './update-consultation.dto';

describe('UpdateConsultationDto', () => {
  it('should validate a valid dto', () => {
    const dto = new UpdateConsultationDto();
    dto.userId = 1;
    dto.patientId = 2;
    dto.scheduleId = 1;
    dto.notes = '';

    const errors = validateSync(dto);
    expect(errors.length).toBe(0);
  });

  it('should validate an valid dto with valid userId', () => {
    const dto = new UpdateConsultationDto();
    dto.userId = 1;
    const errors = validateSync(dto);
    expect(errors.length).toBe(0);
  });

  it('should validate an valid dto with valid patientId', () => {
    const dto = new UpdateConsultationDto();
    dto.patientId = 1;

    const errors = validateSync(dto);
    expect(errors.length).toBe(0);
  });

  it('should validate an valid dto with valid scheduleId', () => {
    const dto = new UpdateConsultationDto();
    dto.scheduleId = 1;

    const errors = validateSync(dto);
    expect(errors.length).toBe(0);
  });
});
