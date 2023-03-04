import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsEnum,
  IsNumber,
  MaxLength,
  IsDate,
  Min,
  IsISO8601,
  IsDateString,
} from 'class-validator';
import { IsAlphaSpaces } from 'src/common/custom-decorator/validation/is-alpha-spaces.valid';
import { IsPhoneNumber } from 'src/common/custom-decorator/validation/is-phone-number.valid';
import { EnumGender } from '../enum/gender.enum';

export class CreatePatientDto {
  @ApiProperty({ description: 'Id do usuário', example: 1234 })
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  userId: number;

  @ApiProperty({ description: 'Nome do paciente', example: 'John Doe' })
  @IsAlphaSpaces({ message: 'nome inválido' })
  @MaxLength(50, { message: 'O nome deve ter menos de 50 caracteres' })
  @Transform(({ value }) => value.toLowerCase())
  name: string;

  @ApiProperty({
    description: 'Telefone do paciente',
    example: '+55 11 1234-5678',
  })
  @IsString()
  @MaxLength(11, {
    message: 'O número de telefone não pode ter mais do que 11 dígitos',
  })
  @IsPhoneNumber({
    message: 'O número de telefone deve conter apenas dígitos numéricos',
  })
  phone: string;

  @ApiProperty({
    description: 'Email do paciente',
    example: 'johndoe@example.com',
  })
  @IsNotEmpty({ message: 'email deve ser preenchido' })
  @IsEmail()
  @MaxLength(100, { message: 'O email deve ter menos de 100 caracteres' })
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  @ApiProperty({
    example: '2000-01-01  - padrão ISO 8601',
    description: 'Data de nascimento do paciente',
  })
  @IsDateString()
  @IsNotEmpty()
  birthDate: Date;

  @ApiProperty({
    enum: EnumGender,
    description: 'Gênero do paciente',
    example: EnumGender.MASCULINO,
  })
  @IsEnum([EnumGender.MASCULINO, EnumGender.FEMININO])
  @IsNotEmpty()
  gender: string;

  @ApiProperty({ description: 'Altura do paciente', example: 1.75 })
  @IsNumber()
  @IsNotEmpty()
  height: number;

  @ApiProperty({ description: 'Peso do paciente', example: 70.5 })
  @IsNumber()
  @IsNotEmpty()
  weight: number;
}
