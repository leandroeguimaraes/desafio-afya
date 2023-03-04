import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsEnum,
  IsNumber,
  MaxLength,
  IsDate,
  Min,
  MinLength,
} from 'class-validator';
import { IsAlphaSpaces } from 'src/common/custom-decorator/validation/is-alpha-spaces.valid';
import { EnumGender } from '../enum/gender.enum';

export class CreatePatientDto {
  @ApiProperty({ description: 'Id do usuário', example: 1234 })
  @IsNumber({}, { message: 'userId - deve ser um número' })
  @IsNotEmpty({ message: 'userId deve ser preenchido' })
  @Min(0, { message: 'userId - o valor deve ser igual ou maior que zero' })
  userId: number;

  @ApiProperty({ description: 'Nome do paciente', example: 'John Doe' })
  @IsAlphaSpaces({ message: 'name - Nome inválido' })
  @MaxLength(50, { message: 'name - O nome deve ter menos de 50 caracteres' })
  @Transform(({ value }) => value.trim().toLowerCase())
  name: string;

  @ApiProperty({
    description: 'Telefone do paciente',
    example: '11992345678',
  })
  @IsString({ message: 'phone - deve ser uma string' })
  @MinLength(10, {
    message: 'phone - o número de telefone não pode ter menos do que 10 dígitos',
  })
  @MaxLength(11, {
    message: 'phone - o número de telefone não pode ter mais do que 11 dígitos',
  })
  @Transform(({ value }) => value.trim())
  phone: string;

  @ApiProperty({
    description: 'Email do paciente',
    example: 'johndoe@example.com',
  })
  @IsNotEmpty({ message: 'email - deve ser preenchido' })
  @IsEmail({}, { message: 'email - inválido' })
  @MaxLength(100, { message: 'email - deve ter menos de 100 caracteres' })
  @Transform(({ value }) => value.trim().toLowerCase())
  email: string;

  @ApiProperty({
    example: '2000-01-01  - padrão ISO 8601',
    description: 'Data de nascimento do paciente',
  })
  @IsDate({ message: 'birthDate -Data inválida, deve seguir o padrão ISO 8601' })
  @Type(() => Date)
  @IsNotEmpty({ message: 'birthDate - deve ser preenchido' })
  birthDate: Date;

  @ApiProperty({
    enum: EnumGender,
    description: 'Gênero do paciente',
    example: EnumGender.MASCULINO,
  })
  @IsEnum([EnumGender.MASCULINO, EnumGender.FEMININO])
  @IsNotEmpty({ message: 'gender - deve ser preenchido' })
  gender: string;

  @ApiProperty({ description: 'height - altura do paciente', example: 1.75 })
  @IsNumber({}, { message: 'height - deve ser um número' })
  @IsNotEmpty({ message: 'height - deve ser preenchido' })
  @Min(0.01, { message: 'height - o valor deve ser maior que zero' })
  height: number;

  @ApiProperty({ description: 'Peso do paciente', example: 70.5 })
  @IsNumber({}, { message: 'weight - deve ser um número' })
  @IsNotEmpty({ message: 'weight - deve ser preenchido' })
  @Min(0.01, { message: 'weight - o valor deve ser maior que zero' })
  weight: number;
}
