import { validateSync } from 'class-validator';
import { UpdateUserDto } from './update-user.dto';

describe('UpdateUserDto', () => {
  it('should validate a valid object', () => {
    const testObject = new UpdateUserDto();
    testObject.name = 'Doctor House';
    testObject.email = 'doctor@gmail.com';
    testObject.password = '!Password123';
    testObject.role = 'doctor';

    const errors = validateSync(testObject);
    expect(errors.length).toBe(0);
  });

  it('should not validate an empty name', () => {
    const testObject = new UpdateUserDto();
    testObject.name = 'a123';

    const errors = validateSync(testObject);
    expect(errors.length).toBeGreaterThan(0);
  });
  it('should not validate an invalid email', () => {
    const testObject = new UpdateUserDto();
    testObject.email = 'invalidemail';

    const errors = validateSync(testObject);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should not validate a weak password', () => {
    const testObject = new UpdateUserDto();
    testObject.password = 'weakpassword';

    const errors = validateSync(testObject);
    expect(errors.length).toBeGreaterThan(0);
  });
  it('should not validate an invalid role', () => {
    const testObject = new UpdateUserDto();
    testObject.role = 'invalid role';

    const errors = validateSync(testObject);
    expect(errors.length).toBeGreaterThan(0);
  });
});
