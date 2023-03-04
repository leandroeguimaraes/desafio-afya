import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { IsAlphaSpaces } from 'src/common/custom-decorator/validation/is-alpha-spaces.valid';
import { IsPhoneNumber } from 'src/common/custom-decorator/validation/is-phone-number.valid';
import { EnumGender } from '../enum/gender.enum';

export class UpdatePatientDto {
  @ApiProperty({ description: 'Id do usuário', example: 1234 })
  @IsNumber({}, { message: 'Deve ser um número' })
  @IsOptional()
  @Min(0, { message: 'O valor deve ser igual ou maior que zero' })
  userId?: number;

  @ApiProperty({ description: 'Nome do paciente', example: 'Doctor House' })
  @IsAlphaSpaces({ message: 'nome inválido' })
  @MaxLength(50, { message: 'O nome deve ter menos de 50 caracteres' })
  @Transform(({ value }) => value.toLowerCase())
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Telefone do paciente',
    example: '+55 11 1234-5678',
  })
  @IsString({ message: 'Deve ser uma string' })
  @MaxLength(11, {
    message: 'O número de telefone não pode ter mais do que 11 dígitos',
  })
  @IsPhoneNumber({
    message: 'O número de telefone deve conter apenas dígitos numéricos',
  })
  @IsOptional()
  phone?: string;

  @ApiProperty({
    description: 'Email do paciente',
    example: 'doctor@gmail.com',
  })
  @IsOptional()
  @IsEmail({}, { message: 'email inválido' })
  @MaxLength(100, { message: 'O email deve ter menos de 100 caracteres' })
  @Transform(({ value }) => value.toLowerCase())
  email?: string;

  @ApiProperty({
    description: 'Data de nascimento do paciente',
    example: '2000-01-01  - padrão ISO 8601',
  })
  @IsDate({ message: 'Data inválida, deve seguir o padrão ISO 8601' })
  @Type(() => Date)
  @IsOptional()
  birthDate?: Date;

  @ApiProperty({
    enum: EnumGender,
    description: 'Gênero do paciente',
    example: EnumGender.MASCULINO,
  })
  @IsEnum([EnumGender.MASCULINO, EnumGender.FEMININO])
  @IsOptional()
  gender?: string;

  @ApiProperty({ description: 'Altura do paciente', example: 1.75 })
  @IsNumber({}, { message: 'Deve ser um número' })
  @IsOptional()
  @Min(1, { message: 'O valor deve ser maior que zero' })
  height?: number;

  @ApiProperty({ description: 'Peso do paciente', example: 70.5 })
  @IsNumber({}, { message: 'Deve ser um número' })
  @IsOptional()
  @Min(1, { message: 'O valor deve ser maior que zero' })
  weight?: number;
}
