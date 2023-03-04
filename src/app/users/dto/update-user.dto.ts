import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsIn,
  IsOptional,
  IsStrongPassword,
  MaxLength,
} from 'class-validator';
import { IsAlphaSpaces } from 'src/common/custom-decorator/validation/is-alpha-spaces.valid';
import { EnumRole } from '../enum/roles.enum';

export class UpdateUserDto {
  @ApiProperty({
    description: 'Nome do usuário',
    maxLength: 50,
    example: 'João Silva',
  })
  @IsAlphaSpaces({ message: 'nome inválido' })
  @MaxLength(50, { message: 'O nome deve ter menos de 50 caracteres' })
  @Transform(({ value }) => value.toLowerCase())
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'E-mail do usuário',
    maxLength: 100,
    example: 'joao.silva@gmail.com',
  })
  @IsEmail()
  @MaxLength(100, { message: 'O email deve ter menos de 100 caracteres' })
  @Transform(({ value }) => value.toLowerCase())
  @IsOptional()
  email?: string;

  @ApiProperty({
    description: 'Senha do usuário',
    maxLength: 50,
    example: '!SenhaSegura123',
  })
  @MaxLength(50, { message: 'O nome deve ter menos de 50 caracteres' })
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  @IsOptional()
  password?: string;

  @ApiProperty({
    description: 'Papel do usuário',
    enum: EnumRole,
    example: EnumRole.DOCTOR,
    required: false,
  })
  @IsOptional()
  @IsIn([EnumRole.ADMIN, EnumRole.DOCTOR])
  role?: string;
}
