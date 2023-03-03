import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/app/users/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne } from 'typeorm';

@Entity({ name: 'patients' })
export class Patient {
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({ description: 'Id do usuário' })
    @Column({ nullable: false })
    userId: number;

    @ApiProperty({ example: 'João Silva', description: 'Nome do usuário' })
    @Column({ nullable: false, type: 'varchar', length: 50 })
    name: string;

    @ApiProperty({ description: 'Telefone do paciente' })
    @Column({ nullable: false })
    phone: string;

    @ApiProperty({ description: 'Email do paciente' })
    @Column({ unique: true, type: 'varchar', length: 100 })
    email: string;

    @ApiProperty({ example: '2000-01-01  - padrão ISO 8601', description: 'Data de nascimento do paciente' })
    @Column({ nullable: false })
    birthDate: Date;

    @ApiProperty({ enum: ['Masculino', 'Feminino'], description: 'Gênero do paciente' })
    @Column({ nullable: false })
    gender: string;

    @ApiProperty({ description: 'Altura do paciente' })
    @Column({ nullable: false, type: "decimal", precision: 3, scale: 2, default: 0 })
    height: number;

    @ApiProperty({ description: 'Peso do paciente' })
    @Column({ nullable: false, type: "decimal", precision: 4, scale: 1, default: 0 })
    weight: number;

    @ApiProperty({ description: 'Data de criação do registro' })
    @CreateDateColumn({ name: 'created_at' })
    createdAt: string;

    @ApiProperty({ description: 'Data de atualização do registro' })
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: string;

    @ApiProperty({ description: 'Data de exclusão do registro' })
    @DeleteDateColumn({ name: 'deleted_at' })
    deletedAt: string;

    @ApiProperty({ type: () => User, description: 'Usuário que criou o registro' })
    @ManyToOne(() => User, (user) => user.patients)
    user: User;
}