import { validateSync } from 'class-validator';
import { IsPhoneNumber } from './is-phone-number.valid';

class TestClass {
  @IsPhoneNumber({
    message: 'O número de telefone deve conter apenas dígitos numéricos',
  })
  phone: string;
}

describe('IsPhoneNumber', () => {
  it('should validate phone number with only digits', () => {
    const testObject = new TestClass();
    testObject.phone = '1234567890';

    const errors = validateSync(testObject);
    expect(errors.length).toBe(0);
  });

  it('should not validate phone number with non-digit characters', () => {
    const testObject = new TestClass();
    testObject.phone = '12345-67890';

    const errors = validateSync(testObject);
    expect(errors.length).toBe(1);
    expect(errors[0].constraints).toMatchObject({
      IsPhoneNumber:
        'O número de telefone deve conter apenas dígitos numéricos',
    });
  });

  it('should not validate empty phone number', () => {
    const testObject = new TestClass();
    testObject.phone = '';

    const errors = validateSync(testObject);
    expect(errors.length).toBe(1);
    expect(errors[0].constraints).toMatchObject({
      IsPhoneNumber:
        'O número de telefone deve conter apenas dígitos numéricos',
    });
  });
});
