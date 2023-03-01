import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsStrongPassword(validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'IsStrongPassword',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any) {
          const regex =
            /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/;
          const match = regex.test(value);
          return match;
        },
        defaultMessage() {
          return 'A senha deve conter: caracter especial, letra maiúscula, letra minúscula, número, superior a 8 caracteres';
        },
      },
    });
  };
}
