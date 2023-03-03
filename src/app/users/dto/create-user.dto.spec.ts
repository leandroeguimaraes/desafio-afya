import { validateSync } from 'class-validator';
import { CreateUserDto } from './create-user.dto';
import { EnumRole } from '../enum/roles.enum';

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
    userDto.name = 'João Silva';
    userDto.email = 'invalid email';
    userDto.password = 'weakpassword';
    userDto.role = 'invalid role';

    const errors = validateSync(userDto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
