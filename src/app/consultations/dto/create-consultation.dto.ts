import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  IsOptional,
} from 'class-validator';

export class CreateConsultationDto {
  @ApiProperty({
    description: 'Id do usuário que realizou a consulta',
    example: 1,
  })
  @IsNumber({}, { message: 'Deve ser um número' })
  @IsNotEmpty({ message: 'Deve ser preenchido' })
  @Min(1, { message: 'O valor deve ser maior que zero' })
  userId: number;

  @ApiProperty({
    description: 'Id do paciente relacionado à consulta',
    example: 1,
  })
  @IsNotEmpty({ message: 'Deve ser preenchido' })
  @IsNumber({}, { message: 'Deve ser um número' })
  @Min(1, { message: 'O valor deve ser maior que zero' })
  patientId: number;

  @ApiProperty({
    description: 'Id do agendamento relacionado à consulta',
    example: 1,
  })
  @IsNotEmpty({ message: 'Deve ser preenchido' })
  @IsNumber({}, { message: 'Deve ser um número' })
  @Min(1, { message: 'O valor deve ser maior que zero' })
  scheduleId: number;

  @ApiProperty({
    description: 'Notas adicionais sobre a consulta',
    example: 'Paciente apresentou sintomas X, Y e Z',
    required: false,
  })
  @IsString({ message: 'Deve ser uma string' })
  @Transform(({ value }) => value.trim())
  @IsOptional()
  notes?: string;
}
