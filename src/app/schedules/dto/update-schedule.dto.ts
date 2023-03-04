import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsOptional, Min } from 'class-validator';

export class UpdateScheduleDto {
  @ApiProperty({ description: 'Id do usuário', example: 1234 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  userId?: number;

  @ApiProperty({
    description: 'Id do paciente',
    example: 5678,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  patientId?: number;

  @ApiProperty({
    description: 'Data do agendamento',
    example: '2000-01-01  - padrão ISO 8601',
  })
  @IsDateString()
  @IsOptional()
  date?: Date;
}
