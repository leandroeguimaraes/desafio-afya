import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsString, Min } from 'class-validator';

export class UpdateConsultationDto {
  @ApiProperty({
    description: 'Id do usuário que realizou a consulta',
    example: 1,
  })
  @IsNumber({}, { message: 'userId - deve ser um número' })
  @Min(1, { message: 'userId - o valor deve ser maior que zero' })
  userId: number;

  @ApiProperty({
    description: 'Id do paciente relacionado à consulta',
    example: 1,
  })
  @IsNumber({}, { message: 'patientId - deve ser um número' })
  @Min(1, { message: 'patientId - o valor deve ser maior que zero' })
  patientId: number;

  @ApiProperty({
    description: 'Id do agendamento relacionado à consulta',
    example: 1,
  })
  @IsNumber({}, { message: 'scheduleId - deve ser um número' })
  @Min(1, { message: 'scheduleId - o valor deve ser maior que zero' })
  scheduleId: number;

  @ApiProperty({
    description: 'Notas adicionais sobre a consulta',
    example: 'Paciente apresentou sintomas X, Y e Z',
    required: false,
  })
  @IsString({ message: 'notes - deve ser uma string' })
  @Transform(({ value }) => value.trim())
  notes: string;
}
