import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateConsultationDto {
  @ApiProperty({
    description: 'Id do usuário que realizou a consulta',
    example: 1,
  })
  @IsNumber({}, { message: 'Deve ser um número' })
  @IsOptional()
  @Min(1, { message: 'O valor deve ser maior que zero' })
  userId?: number;

  @ApiProperty({
    description: 'Id do paciente relacionado à consulta',
    example: 1,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Deve ser um número' })
  @Min(1, { message: 'O valor deve ser maior que zero' })
  patientId?: number;

  @ApiProperty({
    description: 'Id do agendamento relacionado à consulta',
    example: 1,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Deve ser um número' })
  @Min(1, { message: 'O valor deve ser maior que zero' })
  scheduleId?: number;

  @ApiProperty({
    description: 'Notas adicionais sobre a consulta',
    example: 'Paciente apresentou sintomas X, Y e Z',
    required: false,
  })
  @IsString({ message: 'Deve ser uma string' })
  @IsOptional()
  notes?: string;
}
