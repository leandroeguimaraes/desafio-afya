import { validate } from 'class-validator';
import { IsAlphaSpaces } from './is-alpha-spaces.valid';

class TestClass {
  @IsAlphaSpaces()
  name: string;
}

describe('IsAlphaSpaces', () => {
  it('should validate string with only alphabetic characters and spaces', async () => {
    const testObj = new TestClass();
    testObj.name = 'Doctor House';
    const errors = await validate(testObj);
    expect(errors.length).toBe(0);
  });

  it('should not validate string with non-alphabetic characters', async () => {
    const testObj = new TestClass();
    testObj.name = 'John123';
    const errors = await validate(testObj);
    expect(errors.length).toBe(1);
    expect(errors[0].constraints).toEqual({
      IsAlphaSpaces:
        'name must contain only alphabetical characters and spaces',
    });
  });

  it('should not validate string with special characters', async () => {
    const testObj = new TestClass();
    testObj.name = 'John#Doe';
    const errors = await validate(testObj);
    expect(errors.length).toBe(1);
    expect(errors[0].constraints).toEqual({
      IsAlphaSpaces:
        'name must contain only alphabetical characters and spaces',
    });
  });

  it('should not validate string with leading or trailing spaces', async () => {
    const testObj = new TestClass();
    testObj.name = '  Doctor House  ';
    const errors = await validate(testObj);
    expect(errors.length).toBe(1);
    expect(errors[0].constraints).toEqual({
      IsAlphaSpaces:
        'name must contain only alphabetical characters and spaces',
    });
  });
});
