import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateConsultationDto {
  @ApiProperty({
    description: 'Id do usuário que realizou a consulta',
    example: 1,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  userId?: number;

  @ApiProperty({
    description: 'Id do paciente relacionado à consulta',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  patientId?: number;

  @ApiProperty({
    description: 'Id do agendamento relacionado à consulta',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  scheduleId?: number;

  @ApiProperty({
    description: 'Notas adicionais sobre a consulta',
    example: 'Paciente apresentou sintomas X, Y e Z',
    required: false,
  })
  @IsString()
  @IsOptional()
  notes?: string;
}
