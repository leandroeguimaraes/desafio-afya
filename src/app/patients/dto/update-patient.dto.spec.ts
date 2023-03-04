import { validateSync } from 'class-validator';
import { EnumGender } from '../enum/gender.enum';
import { UpdatePatientDto } from './update-patient.dto';

describe('UpdatePatientDto', () => {
  it('should validate a valid object', () => {
    const testObject = new UpdatePatientDto();
    testObject.name = 'Doctor House';
    testObject.email = 'doctor@gmail.com';
    testObject.phone = '1123456789';
    testObject.birthDate = new Date('2000-01-01');
    testObject.gender = EnumGender.MASCULINO;
    testObject.height = 1.75;
    testObject.weight = 70.5;
    testObject.userId = 1;

    const errors = validateSync(testObject);
    expect(errors.length).toBe(0);
  });

  it('should not validate an empty name', () => {
    const testObject = new UpdatePatientDto();
    testObject.name = 'a123';

    const errors = validateSync(testObject);
    expect(errors.length).toBeGreaterThan(0);
  });
  it('should not validate an invalid email', () => {
    const testObject = new UpdatePatientDto();
    testObject.email = 'invalidemail';

    const errors = validateSync(testObject);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should not validate an invalid phone number', () => {
    const testObject = new UpdatePatientDto();
    testObject.phone = '+1-541-754-3010'; // invalid phone number for Brazil

    const errors = validateSync(testObject);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should not validate an invalid birth date', () => {
    const testObject = new UpdatePatientDto();
    testObject.birthDate = new Date('invalid date');

    const errors = validateSync(testObject);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should not validate an invalid gender', () => {
    const testObject = new UpdatePatientDto();
    testObject.gender = 'invalid gender' as EnumGender;

    const errors = validateSync(testObject);
    expect(errors.length).toBeGreaterThan(0);
  });
  it('should not validate an invalid height', () => {
    const testObject = new UpdatePatientDto();
    testObject.height = 0;

    const errors = validateSync(testObject);
    expect(errors.length).toBeGreaterThan(0);
  });
  it('should not validate an invalid weight', () => {
    const testObject = new UpdatePatientDto();
    testObject.weight = -10;

    const errors = validateSync(testObject);
    expect(errors.length).toBeGreaterThan(0);
  });
});