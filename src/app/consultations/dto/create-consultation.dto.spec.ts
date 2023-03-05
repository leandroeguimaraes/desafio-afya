import { plainToClass } from 'class-transformer';
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
  describe('userId', () => {
    it('should a validate userId', () => {
      const consultationDto = new CreateConsultationDto();
      consultationDto.userId = 1;
      consultationDto.patientId = 1;
      consultationDto.scheduleId = 1;
      consultationDto.notes = '123';

      const errors = validateSync(consultationDto);
      expect(errors.length).toBe(0);
    });
    it('should throw an error if userId is not a number', () => {
      const consultationDto = new CreateConsultationDto();
      consultationDto.userId = 'aa' as any;
      consultationDto.patientId = 1;
      consultationDto.scheduleId = 1;
      consultationDto.notes = '123';

      const errors = validateSync(consultationDto);
      expect(errors.length).toBe(1);
    });

    it('should throw an error if userId is not provided', () => {
      const consultationDto = new CreateConsultationDto();
      consultationDto.userId = undefined;
      consultationDto.patientId = 1;
      consultationDto.scheduleId = 1;
      consultationDto.notes = '123';

      const errors = validateSync(consultationDto);
      expect(errors.length).toBe(1);
    });

    it('should throw an error if userId is less than 1', () => {
      const consultationDto = new CreateConsultationDto();
      consultationDto.userId = -1;
      consultationDto.patientId = 1;
      consultationDto.scheduleId = 1;
      consultationDto.notes = '123';

      const errors = validateSync(consultationDto);
      expect(errors.length).toBe(1);
    });
  });

  describe('patientId', () => {
    it('should a validate patientId', () => {
      const consultationDto = new CreateConsultationDto();
      consultationDto.userId = 1;
      consultationDto.patientId = 1;
      consultationDto.scheduleId = 1;
      consultationDto.notes = '123';

      const errors = validateSync(consultationDto);
      expect(errors.length).toBe(0);
    });
    it('should throw an error if patientId is not a number', () => {
      const consultationDto = new CreateConsultationDto();
      consultationDto.userId = 1;
      consultationDto.patientId = 'aa' as any;
      consultationDto.scheduleId = 1;
      consultationDto.notes = '123';

      const errors = validateSync(consultationDto);
      expect(errors.length).toBe(1);
    });

    it('should throw an error if patientId is not provided', () => {
      const consultationDto = new CreateConsultationDto();
      consultationDto.userId = 1;
      consultationDto.patientId = undefined;
      consultationDto.scheduleId = 1;
      consultationDto.notes = '123';

      const errors = validateSync(consultationDto);
      expect(errors.length).toBe(1);
    });

    it('should throw an error if patientId is less than 1', () => {
      const consultationDto = new CreateConsultationDto();
      consultationDto.userId = 1;
      consultationDto.patientId = -1;
      consultationDto.scheduleId = 1;
      consultationDto.notes = '123';

      const errors = validateSync(consultationDto);
      expect(errors.length).toBe(1);
    });
  });
  describe('scheduleId', () => {
    it('should a validate scheduleId', () => {
      const consultationDto = new CreateConsultationDto();
      consultationDto.userId = 1;
      consultationDto.patientId = 1;
      consultationDto.scheduleId = 1;
      consultationDto.notes = 'Teste anotação';

      const errors = validateSync(consultationDto);
      expect(errors.length).toBe(0);
    });
    it('should throw an error if scheduleId is not a number', () => {
      const consultationDto = new CreateConsultationDto();
      consultationDto.userId = 1;
      consultationDto.patientId = 1;
      consultationDto.scheduleId = 'aa' as any;
      consultationDto.notes = 'Teste anotação';

      const errors = validateSync(consultationDto);
      expect(errors.length).toBe(1);
    });

    it('should throw an error if scheduleId is not provided', () => {
      const consultationDto = new CreateConsultationDto();
      consultationDto.userId = 1;
      consultationDto.patientId = 1;
      consultationDto.scheduleId = undefined;
      consultationDto.notes = 'Teste anotação';

      const errors = validateSync(consultationDto);
      expect(errors.length).toBe(1);
    });

    it('should throw an error if scheduleId is less than 1', () => {
      const consultationDto = new CreateConsultationDto();
      consultationDto.userId = 1;
      consultationDto.patientId = 1;
      consultationDto.scheduleId = -1;
      consultationDto.notes = 'Teste anotação';

      const errors = validateSync(consultationDto);
      expect(errors.length).toBe(1);
    });
  });

  describe('notes', () => {
    it('should a validate notes', () => {
      const consultationDto = new CreateConsultationDto();
      consultationDto.userId = 1;
      consultationDto.patientId = 1;
      consultationDto.scheduleId = 1;
      consultationDto.notes = 'Teste anotação';

      const errors = validateSync(consultationDto);
      expect(errors.length).toBe(0);
    });
    it('should throw an error if notes is a number', () => {
      const consultationDto = new CreateConsultationDto();
      consultationDto.userId = 1;
      consultationDto.patientId = 1;
      consultationDto.scheduleId = 1;
      consultationDto.notes = 123 as any;

      const errors = validateSync(consultationDto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should trim notes when transforming', () => {
      const userDto = plainToClass(CreateConsultationDto, {
        userId: 1,
        patientId: 1,
        scheduleId: 1,
        notes: '   Teste anotação  ',
      });
      const errors = validateSync(userDto);
      expect(errors.length).toBe(0);
      expect(userDto.notes).toBe('Teste anotação');
    });
  });
});
