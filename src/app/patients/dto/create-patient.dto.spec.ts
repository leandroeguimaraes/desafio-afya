import { validateSync } from 'class-validator';
import { EnumGender } from '../enum/gender.enum';
import { CreatePatientDto } from './create-patient.dto';

describe('CreatePatientDto', () => {
  it('should validate a valid dto', () => {
    const patientDto = new CreatePatientDto();
    patientDto.userId = 1;
    patientDto.name = 'Doctor House';
    patientDto.phone = '1123456789';
    patientDto.email = 'doctor@gmail.com';
    patientDto.birthDate = new Date('2017-06-07');
    patientDto.gender = EnumGender.MASCULINO;
    patientDto.height = 1.75;
    patientDto.weight = 70.5;

    const errors = validateSync(patientDto);
    expect(errors.length).toBe(0);
  });

  it('should not validate an invalid dto with missing fields', () => {
    const patientDto = new CreatePatientDto();
    patientDto.name = 'Doctor House';

    const errors = validateSync(patientDto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should not validate an invalid dto with invalid fields', () => {
    const patientDto = new CreatePatientDto();
    patientDto.userId = 1;
    patientDto.name = 'John123';
    patientDto.phone = 'invalid phone number';
    patientDto.email = 'invalid email';
    patientDto.birthDate = new Date('2000-01-01');
    patientDto.gender = 'invalid gender';
    patientDto.height = 1;
    patientDto.weight = 1;

    const errors = validateSync(patientDto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
