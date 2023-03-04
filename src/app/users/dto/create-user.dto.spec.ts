import { validateSync } from 'class-validator';
import { CreateUserDto } from './create-user.dto';
import { EnumRole } from '../enum/roles.enum';
import { plainToClass, plainToInstance } from 'class-transformer';

describe('CreateUserDto', () => {
  it('should validate a valid dto', () => {
    const userDto = new CreateUserDto();
    userDto.name = 'Doctor House';
    userDto.email = 'doctor@gmail.com';
    userDto.password = 'StrongPassword123!';
    userDto.role = EnumRole.DOCTOR;

    const errors = validateSync(userDto);
    expect(errors.length).toBe(0);
  });

  it('should not validate an invalid dto with missing fields', () => {
    const userDto = new CreateUserDto();
    userDto.email = 'doctor@gmail.com';
    userDto.password = 'StrongPassword123!';
    userDto.role = EnumRole.DOCTOR;

    const errors = validateSync(userDto);
    expect(errors.length).toBeGreaterThan(0);
  });
  it('should not validate an invalid dto with invalid name', () => {
    const userDto = new CreateUserDto();
    userDto.name = 'Doctor123 House';
    userDto.email = 'doctor@gmail.com';
    userDto.password = 'StrongPassword123!';
    userDto.role = EnumRole.DOCTOR;

    const errors = validateSync(userDto);
    expect(errors.length).toBeGreaterThan(0);
  });
  it('should not validate an invalid dto with name with more than 50 chars', () => {

    const userDto = new CreateUserDto();
    userDto.name = 'a'.repeat(51);
    userDto.email = 'doctor@gmail.com';
    userDto.password = 'StrongPassword123!';
    userDto.role = EnumRole.DOCTOR;

    const errors = validateSync(userDto);
    expect(errors.length).toBeGreaterThan(0);
  });
  it('should transform a dto with valid name with spaces at the beginning and end to name with no spaces and transformed to lowercase', () => {
    const userDto = plainToClass(CreateUserDto, {
      name: '   Doctor House  ',
      email: 'doctor@gmail.com',
      password: 'StrongPassword123!',
      role: EnumRole.DOCTOR
    })

    const errors = validateSync(userDto);
    expect(errors.length).toBe(0);
    expect(userDto.name).toBe('doctor house');
  });
  it('should not validate an invalid dto with invalid email', () => {
    const userDto = new CreateUserDto();
    userDto.name = 'Doctor House';
    userDto.email = 'doctor@@@gmail.com';
    userDto.password = 'StrongPassword123!';
    userDto.role = EnumRole.DOCTOR;

    const errors = validateSync(userDto);
    expect(errors.length).toBeGreaterThan(0);
  });
  it('should not validate an invalid dto with email with more than 100 chars', () => {

    const userDto = new CreateUserDto();
    userDto.name = 'Doctor House';
    userDto.email = 'a'.repeat(100) + '@gmail.com';
    userDto.password = 'StrongPassword123!';
    userDto.role = EnumRole.DOCTOR;

    const errors = validateSync(userDto);
    expect(errors.length).toBeGreaterThan(0);
  });
  it('should transform a dto with valid email with spaces at the beginning and end to email with no spaces and transformed to lowercase', () => {
    const userDto = plainToClass(CreateUserDto, {
      name: 'Doctor House',
      email: '     DOCTOR@gmail.com        ',
      password: 'StrongPassword123!',
      role: EnumRole.DOCTOR
    })
    const errors = validateSync(userDto);
    expect(errors.length).toBe(0);
    expect(userDto.email).toBe('doctor@gmail.com');
  });
  it('should not validate an invalid dto with weak password', () => {
    const userDto = new CreateUserDto();
    userDto.name = 'Doctor House';
    userDto.email = 'doctor@gmail.com';
    userDto.password = 'weakpassword';
    userDto.role = EnumRole.DOCTOR;

    const errors = validateSync(userDto);
    expect(errors.length).toBeGreaterThan(0);
  });
  it('should not validate an invalid dto with invalid role', () => {
    const userDto = new CreateUserDto();
    userDto.name = 'Doctor House';
    userDto.email = 'doctor@gmail.com';
    userDto.password = 'StrongPassword123!';
    userDto.role = "user";

    const errors = validateSync(userDto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
