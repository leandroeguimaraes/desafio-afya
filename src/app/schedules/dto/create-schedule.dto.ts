import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateScheduleDto {
  @ApiProperty({ description: 'Id do usuário', example: 1234 })
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  userId: number;

  @ApiProperty({
    description: 'Id do paciente',
    example: 5678,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  patientId: number;

  @ApiProperty({
    description: 'Data do agendamento',
    example: '2000-01-01  - padrão ISO 8601',
  })
  @IsDate()
  @IsNotEmpty()
  date: Date;
}
