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

  it('should not validate an invalid dto with invalid userId', () => {
    const dto = new UpdateConsultationDto();
    dto.userId = null;
    dto.patientId = 2;
    const errors = validateSync(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should not validate an invalid dto with invalid patientId', () => {
    const dto = new UpdateConsultationDto();
    dto.patientId = null;

    const errors = validateSync(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should not validate an invalid dto with invalid scheduleId', () => {
    const dto = new UpdateConsultationDto();
    dto.scheduleId = null;

    const errors = validateSync(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
