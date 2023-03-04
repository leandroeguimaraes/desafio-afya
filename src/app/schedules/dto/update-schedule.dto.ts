import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNumber, Min } from 'class-validator';

export class UpdateScheduleDto {
  @ApiProperty({ description: 'Id do usuário', example: 1234 })
  @IsNumber({}, { message: 'userId - deve ser um número' })
  @Min(1, { message: 'userId - deve ser maior que zero' })
  userId: number;

  @ApiProperty({
    description: 'Id do paciente',
    example: 5678,
  })
  @IsNumber({}, { message: 'patientId - deve ser um número' })
  @Min(1, { message: 'patientId - deve ser maior que zero' })
  patientId: number;

  @ApiProperty({
    description: 'Data do agendamento',
    example: '2000-01-01  - padrão ISO 8601',
  })
  @IsDate({ message: 'date - inválida, deve seguir o padrão ISO 8601' })
  @Type(() => Date)
  date: Date;
}
