import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsAlphaSpaces(validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'IsAlphaSpaces',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any) {
          const regex = /^[a-zA-Z ]*$/;
          const match = regex.test(value);
          return match && value;
        },
      },
    });
  };
}
