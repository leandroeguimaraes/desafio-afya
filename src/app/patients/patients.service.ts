import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Equal, IsNull, Not, Repository } from 'typeorm';
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
    const existingPatient = await this.patientsRepository.findOneBy({ email });

    if (existingPatient) {
      throw new ConflictException(
        `Paciente com email ${createPatientDto.email} já existe`,
      );
    }
    const patient = this.patientsRepository.create(createPatientDto);
    return await this.patientsRepository.save(patient);
  }

  async findAll(activeOnly = false): Promise<Patient[]> {
    const query = this.patientsRepository
      .createQueryBuilder('patient')
      .leftJoinAndSelect('patient.user', 'user');

    if (activeOnly) {
      query.andWhere(
        new Brackets((qb) => {
          qb.where({ deletedAt: IsNull() }).orWhere({
            deletedAt: Not(Equal('')),
          });
        }),
      );
    }

    return await query.getMany();
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

  async removeLGPD(id: number): Promise<void> {
    const patient = await this.patientsRepository.findOneBy({ id });
    if (!patient) {
      throw new NotFoundException(`Paciente com id ${id} não foi encontrado`);
    }
    patient.deletedAt = new Date().toISOString();
    patient.name = null;
    patient.email = null;
    patient.phone = null;
    patient.birthDate = null;
    patient.gender = null;
    patient.height = null;
    patient.weight = null;

    await this.patientsRepository.save(patient);
  }
}
