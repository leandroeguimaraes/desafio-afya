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
          if (value[0] === ' ' || value[value.length - 1] === ' ') return false;
          const regex = /^[a-zA-Z ]*$/;
          const match = regex.test(value);
          return match && value;
        },
        defaultMessage() {
          return `${propertyName} must contain only alphabetical characters and spaces`;
        },
      },
    });
  };
}
