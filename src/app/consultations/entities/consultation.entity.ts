import { ApiProperty } from '@nestjs/swagger';
import { Patient } from 'src/app/patients/entities/patient.entity';
import { Schedule } from 'src/app/schedules/entities/schedule.entity';
import { User } from 'src/app/users/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity({ name: 'consultations' })
export class Consultation {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Id do usuário' })
  @Column({ nullable: false })
  userId: number;

  @ApiProperty({ description: 'Id do paciente' })
  @Column({ nullable: false })
  patientId: number;

  @ApiProperty({ description: 'Id do agendamento' })
  @Column({ nullable: false })
  scheduleId: number;

  @ApiProperty({ description: 'Notas adicionais da consulta', nullable: true })
  @Column({ nullable: true })
  notes?: string;

  @ApiProperty({ description: 'Data de criação da consulta' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ description: 'Data da última atualização da consulta' })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ApiProperty({ description: 'Data de exclusão da consulta' })
  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  @ApiProperty({
    description: 'Agendamento associado à consulta',
    type: () => Schedule,
  })
  @ManyToOne(() => Schedule, (schedule) => schedule.consultations)
  schedule: Schedule;

  @ApiProperty({
    description: 'Paciente associado à consulta',
    type: () => Patient,
  })
  @ManyToOne(() => Patient, (patient) => patient.consultations, {
    onDelete: 'CASCADE',
  })
  patient: Patient;

  @ApiProperty({
    description: 'Usuário associado à consulta',
    type: () => User,
  })
  @ManyToOne(() => User, (user) => user.consultations, { onDelete: 'CASCADE' })
  user: User;
}
