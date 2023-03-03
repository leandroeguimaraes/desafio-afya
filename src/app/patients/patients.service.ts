import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { Patient } from './entities/patient.entity';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient)
    private patientsRepository: Repository<Patient>,
  ) {}

  async create(createPatientDto: CreatePatientDto): Promise<Patient> {
    const { email } = createPatientDto;
    const existingUser = await this.patientsRepository.findOneBy({ email });

    if (existingUser) {
      throw new ConflictException(
        `Paciente com email ${createPatientDto.email} já existe`,
      );
    }
    const patient = this.patientsRepository.create(createPatientDto);
    return await this.patientsRepository.save(patient);
  }

  async findAll(): Promise<Patient[]> {
    return await this.patientsRepository
      .createQueryBuilder('patient')
      .leftJoinAndSelect('patient.user', 'user')
      .getMany();
  }

  async findOne(id: number): Promise<Patient> {
    const patient = await this.patientsRepository.findOneBy({ id });
    if (!patient) {
      throw new NotFoundException(`Paciente com id ${id} não foi encontrado`);
    }
    return patient;
  }

  async update(
    id: number,
    updatePatientDto: UpdatePatientDto,
  ): Promise<Patient> {
    const patient = await this.findOne(id);
    this.patientsRepository.merge(patient, updatePatientDto);
    return await this.patientsRepository.save(patient);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.patientsRepository.delete(id);
  }
}
