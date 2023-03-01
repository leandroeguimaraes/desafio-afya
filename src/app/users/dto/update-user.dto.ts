import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { EnumRole } from '../enum/roles.enum';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({
    description: 'Nome do usuário',
    maxLength: 50,
    example: 'João Silva',
    required: false,
  })
  name?: string;

  @ApiProperty({
    description: 'E-mail do usuário',
    maxLength: 100,
    example: 'joao.silva@gmail.com',
    required: false,
  })
  email?: string;

  @ApiProperty({
    description: 'Senha do usuário',
    maxLength: 50,
    example: '!SenhaSegura123',
    required: false,
  })
  password?: string;

  @ApiProperty({
    description: 'Papel do usuário',
    enum: EnumRole,
    example: EnumRole.DOCTOR,
    required: false,
  })
  role?: string;
}
