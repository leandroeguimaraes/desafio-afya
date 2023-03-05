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
import { EnumGender } from './enum/gender.enum';

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

  async findAll(): Promise<Patient[]> {
    const query = this.patientsRepository
      .createQueryBuilder('patient')
      .leftJoinAndSelect('patient.user', 'user');

    return await query.getMany();
  }

  async findOne(id: number): Promise<Patient> {
    const patient = await this.patientsRepository
      .createQueryBuilder('patient')
      .leftJoinAndSelect('patient.user', 'user')
      .where('patient.id = :id', { id })
      .getOne();

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
    const patient = await this.findOne(id);

    patient.deletedAt = new Date();
    patient.name = 'User Deleted';
    patient.email = Date.now() + 'userdeleted@gmail.com';
    patient.phone = '11999999999';
    patient.birthDate = new Date();
    patient.gender = EnumGender.MASCULINO;
    patient.height = 0.01;
    patient.weight = 0.01;

    await this.patientsRepository.save(patient);
  }
}
