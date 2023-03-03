import { validateSync } from 'class-validator';
import { CreateConsultationDto } from './create-consultation.dto';

describe('CreateConsultationDto', () => {
  it('should validate a valid dto', () => {
    const consultationDto = new CreateConsultationDto();
    consultationDto.userId = 1;
    consultationDto.patientId = 2;
    consultationDto.scheduleId = 3;
    consultationDto.notes = 'Paciente apresentou sintomas X, Y e Z';
    const errors = validateSync(consultationDto);
    expect(errors.length).toBe(0);
  });
  it('should not validate an invalid dto with missing fields', () => {
    const consultationDto = new CreateConsultationDto();
    consultationDto.userId = 1;
    const errors = validateSync(consultationDto);
    expect(errors.length).toBeGreaterThan(0);
  });
  it('should not validate an invalid dto with invalid fields', () => {
    const consultationDto = new CreateConsultationDto();
    consultationDto.userId = -1;
    consultationDto.patientId = -1;
    consultationDto.scheduleId = -1;
    consultationDto.notes = '123';
    const errors = validateSync(consultationDto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
