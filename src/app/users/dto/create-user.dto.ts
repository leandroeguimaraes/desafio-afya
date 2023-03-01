import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  MaxLength,
} from 'class-validator';
import { IsAlphaSpaces } from 'src/common/custom-decorator/validation/is-alpha-spaces.valid';
import { IsStrongPassword } from 'src/common/custom-decorator/validation/is-strong-password.valid';
import { EnumRole } from '../enum/roles.enum';

export class CreateUserDto {
  @IsAlphaSpaces({ message: 'nome inválido' })
  @MaxLength(50, { message: 'O nome deve ter menos de 50 caracteres' })
  @Transform(({ value }) => value.toLowerCase())
  name: string;

  @IsNotEmpty({ message: 'email deve ser preenchido' })
  @IsEmail()
  @MaxLength(100, { message: 'O email deve ter menos de 100 caracteres' })
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  @IsNotEmpty({ message: 'senha deve ser preenchido' })
  @MaxLength(50, { message: 'O nome deve ter menos de 50 caracteres' })
  @IsStrongPassword()
  password: string;

  @IsOptional()
  @IsIn([EnumRole.ADMIN, EnumRole.DOCTOR])
  role: string;
}
