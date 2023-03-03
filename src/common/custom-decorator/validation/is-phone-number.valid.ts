import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsPhoneNumber(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'IsPhoneNumber',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any) {
                    const phoneNumberRegex = /^[0-9]+$/;
                    if (!value || !value.match(phoneNumberRegex)) {
                        return false;
                    }
                    return true;
                },
                defaultMessage(args: ValidationArguments) {
                    return `${args.property} deve conter apenas dígitos numéricos`;
                },
            },
        });
    };
}