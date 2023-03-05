import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateScheduleDto {
  @ApiProperty({ description: 'Id do usuário', example: 1234 })
  @IsNumber({}, { message: 'userId - deve ser um número' })
  @IsNotEmpty({ message: 'userId - deve ser preenchido' })
  @Min(1, { message: 'userId - deve ser maior que zero' })
  userId: number;

  @ApiProperty({
    description: 'Id do paciente',
    example: 5678,
  })
  @IsNumber({}, { message: 'Id do paciente deve ser um número' })
  @IsNotEmpty({ message: 'patientId - deve ser preenchido' })
  @Min(1, { message: 'patientId - deve ser maior que zero' })
  patientId: number;

  @ApiProperty({
    description: 'Data do agendamento',
    example: '2000-01-01  - padrão ISO 8601',
  })
  @IsDate({ message: 'date - Data inválida, deve seguir o padrão ISO 8601' })
  @Type(() => Date)
  @IsNotEmpty({ message: 'date - deve ser preenchido' })
  date: Date;
}
