import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { IsAlphaSpaces } from 'src/common/custom-decorator/validation/is-alpha-spaces.valid';
import { EnumGender } from '../enum/gender.enum';

export class UpdatePatientDto {
  @ApiProperty({ description: 'Id do usuário', example: 1234 })
  @IsNumber({}, { message: 'userId - deve ser um número' })
  @IsNotEmpty({ message: 'userId - deve ser preenchido' })
  @Min(0, { message: 'userId - o valor deve ser igual ou maior que zero' })
  userId: number;

  @ApiProperty({ description: 'Nome do paciente', example: 'Doctor House' })
  @IsAlphaSpaces({ message: 'name - nome inválido' })
  @MaxLength(50, { message: 'name - deve ter menos de 50 caracteres' })
  @Transform(({ value }) => value.trim().toLowerCase())
  @IsOptional()
  name: string;

  @ApiProperty({
    description: 'Telefone do paciente',
    example: '11992345678',
  })
  @IsString({ message: 'Deve ser uma string' })
  @MinLength(10, {
    message: 'phone - O número de telefone não pode ter menos do que 10 dígitos',
  })
  @MaxLength(11, {
    message: 'phone - O número de telefone não pode ter mais do que 11 dígitos',
  })
  @Transform(({ value }) => value.trim())
  phone: string;

  @ApiProperty({
    description: 'Email do paciente',
    example: 'doctor@gmail.com',
  })
  @IsEmail({}, { message: 'email inválido' })
  @MaxLength(100, { message: 'O email deve ter menos de 100 caracteres' })
  @Transform(({ value }) => value.trim().toLowerCase())
  email: string;

  @ApiProperty({
    description: 'Data de nascimento do paciente',
    example: '2000-01-01  - padrão ISO 8601',
  })
  @IsDate({ message: 'date - data inválida, deve seguir o padrão ISO 8601' })
  @Type(() => Date)
  birthDate: Date;

  @ApiProperty({
    enum: EnumGender,
    description: 'Gênero do paciente',
    example: EnumGender.MASCULINO,
  })
  @IsEnum([EnumGender.MASCULINO, EnumGender.FEMININO])
  gender: string;

  @ApiProperty({ description: 'Altura do paciente', example: 1.75 })
  @IsNumber({}, { message: 'height - deve ser um número' })
  @Min(0.01, { message: 'height - o valor deve ser maior que zero' })
  height: number;

  @ApiProperty({ description: 'Peso do paciente', example: 70.5 })
  @IsNumber({}, { message: 'height - deve ser um número' })
  @Min(0.01, { message: 'height - o valor deve ser maior que zero' })
  weight: number;
}
