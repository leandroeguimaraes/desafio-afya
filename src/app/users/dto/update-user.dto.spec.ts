import { plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';
import { EnumRole } from '../enum/roles.enum';
import { UpdateUserDto } from './update-user.dto';

describe('UpdateUserDto', () => {
  it('should validate a valid object', () => {
    const testObject = new UpdateUserDto();
    testObject.name = 'Doctor House';
    testObject.email = 'doctor@gmail.com';
    testObject.password = '!Password123';
    testObject.role = EnumRole.DOCTOR;

    const errors = validateSync(testObject);
    expect(errors.length).toBe(0);
  });

  it('should not validate an invalid dto with missing fields', () => {
    const userDto = new UpdateUserDto();
    userDto.email = 'doctor@gmail.com';
    userDto.password = 'StrongPassword123!';
    userDto.role = EnumRole.DOCTOR;

    const errors = validateSync(userDto);
    expect(errors.length).toBeGreaterThan(0);
  });
  it('should not validate an invalid dto with invalid name', () => {
    const userDto = new UpdateUserDto();
    userDto.name = 'Doctor123 House';
    userDto.email = 'doctor@gmail.com';
    userDto.password = 'StrongPassword123!';
    userDto.role = EnumRole.DOCTOR;

    const errors = validateSync(userDto);
    expect(errors.length).toBeGreaterThan(0);
  });
  it('should not validate an invalid dto with name with more than 50 chars', () => {
    const userDto = new UpdateUserDto();
    userDto.name = 'a'.repeat(51);
    userDto.email = 'doctor@gmail.com';
    userDto.password = 'StrongPassword123!';
    userDto.role = EnumRole.DOCTOR;

    const errors = validateSync(userDto);
    expect(errors.length).toBeGreaterThan(0);
  });
  it('should transform a dto with valid name with spaces at the beginning and end to name with no spaces and transformed to lowercase', () => {
    const userDto = plainToClass(UpdateUserDto, {
      name: '   Doctor House  ',
      email: 'doctor@gmail.com',
      password: 'StrongPassword123!',
      role: EnumRole.DOCTOR,
    });

    const errors = validateSync(userDto);
    expect(errors.length).toBe(0);
    expect(userDto.name).toBe('doctor house');
  });
  it('should not validate an invalid dto with invalid email', () => {
    const userDto = new UpdateUserDto();
    userDto.name = 'Doctor House';
    userDto.email = 'doctor@@@gmail.com';
    userDto.password = 'StrongPassword123!';
    userDto.role = EnumRole.DOCTOR;

    const errors = validateSync(userDto);
    expect(errors.length).toBeGreaterThan(0);
  });
  it('should not validate an invalid dto with email with more than 100 chars', () => {
    const userDto = new UpdateUserDto();
    userDto.name = 'Doctor House';
    userDto.email = 'a'.repeat(100) + '@gmail.com';
    userDto.password = 'StrongPassword123!';
    userDto.role = EnumRole.DOCTOR;

    const errors = validateSync(userDto);
    expect(errors.length).toBeGreaterThan(0);
  });
  it('should transform a dto with valid email with spaces at the beginning and end to email with no spaces and transformed to lowercase', () => {
    const userDto = plainToClass(UpdateUserDto, {
      name: 'Doctor House',
      email: '     DOCTOR@gmail.com        ',
      password: 'StrongPassword123!',
      role: EnumRole.DOCTOR,
    });
    const errors = validateSync(userDto);
    expect(errors.length).toBe(0);
    expect(userDto.email).toBe('doctor@gmail.com');
  });
  it('should not validate an invalid dto with weak password', () => {
    const userDto = new UpdateUserDto();
    userDto.name = 'Doctor House';
    userDto.email = 'doctor@gmail.com';
    userDto.password = 'weakpassword';
    userDto.role = EnumRole.DOCTOR;

    const errors = validateSync(userDto);
    expect(errors.length).toBeGreaterThan(0);
  });
  it('should not validate an invalid dto with invalid role', () => {
    const userDto = new UpdateUserDto();
    userDto.name = 'Doctor House';
    userDto.email = 'doctor@gmail.com';
    userDto.password = 'StrongPassword123!';
    userDto.role = 'user';

    const errors = validateSync(userDto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
