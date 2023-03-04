import { ApiProperty } from '@nestjs/swagger';
import { Consultation } from 'src/app/consultations/entities/consultation.entity';
import { Patient } from 'src/app/patients/entities/patient.entity';
import { User } from 'src/app/users/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';

@Entity({ name: 'schedules' })
export class Schedule {
  @ApiProperty({
    description: 'Id do agendamento',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Id do usuário',
    example: 1,
  })
  @Column({ nullable: false })
  userId: number;

  @ApiProperty({
    description: 'Id do paciente',
    example: 1,
  })
  @Column({ nullable: false })
  patientId: number;

  @ApiProperty({
    description: 'Data do agendamento',
    example: '2000-01-01  - padrão ISO 8601',
  })
  @Column({ nullable: false })
  date: Date;

  @ApiProperty({
    description: 'Data de criação do agendamento',
  })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({
    description: 'Data da última atualização do agendamento',
  })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ApiProperty({
    description: 'Data de exclusão do agendamento',
  })
  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  @ApiProperty({
    description: 'Usuário associado ao agendamento',
    type: () => User,
  })
  @ManyToOne(() => User, (user) => user.schedules)
  user: User;

  @ApiProperty({
    description: 'Paciente associado ao agendamento',
    type: () => Patient,
  })
  @ManyToOne(() => Patient, (patient) => patient.schedules)
  patient: Patient;

  @ApiProperty({
    description: 'Consulta associado ao agendamento',
    type: () => Consultation,
  })
  @OneToMany(() => Consultation, (consultation) => consultation.schedule)
  consultations: Consultation[];
}
