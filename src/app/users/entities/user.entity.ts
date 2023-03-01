import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EnumRole } from '../enum/roles.enum';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'João Silva', description: 'Nome do usuário' })
  @Column({ nullable: false, type: 'varchar', length: 50 })
  name: string;

  @ApiProperty({
    example: 'joao.silva@gmail.com',
    description: 'Email do usuário',
  })
  @Column({ unique: true, type: 'varchar', length: 100 })
  email: string;

  @ApiProperty({ description: 'Senha do usuário' })
  @Column()
  password: string;

  @ApiProperty({
    example: EnumRole.DOCTOR,
    description: 'Função do usuário (médico, administrador)',
  })
  @Column({ nullable: false, default: EnumRole.DOCTOR })
  role: string;

  @ApiProperty({
    example: '2022-01-01 00:00:00',
    description: 'Data de criação do usuário',
  })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: string;

  @ApiProperty({
    example: '2022-01-02 00:00:00',
    description: 'Data da última atualização do usuário',
  })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: string;

  @ApiProperty({
    example: '2022-01-03 00:00:00',
    description: 'Data de remoção do usuário',
  })
  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: string;
}
