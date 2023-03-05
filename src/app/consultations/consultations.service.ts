import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateConsultationDto } from './dto/create-consultation.dto';
import { UpdateConsultationDto } from './dto/update-consultation.dto';
import { Consultation } from './entities/consultation.entity';

@Injectable()
export class ConsultationsService {
  constructor(
    @InjectRepository(Consultation)
    private consultationsRepository: Repository<Consultation>,
  ) {}

  async create(
    createConsultationDto: CreateConsultationDto,
  ): Promise<Consultation> {
    const { scheduleId } = createConsultationDto;
    const existingConsultation = await this.consultationsRepository.findOne({
      where: { scheduleId },
    });

    if (existingConsultation) {
      throw new ConflictException(`Consulta já existe`);
    }
    const consultation = this.consultationsRepository.create(
      createConsultationDto,
    );
    return await this.consultationsRepository.save(consultation);
  }

  async findAll(): Promise<Consultation[]> {
    return this.consultationsRepository
      .createQueryBuilder('consultation')
      .leftJoinAndSelect('consultation.user', 'user')
      .leftJoinAndSelect('consultation.schedule', 'schedule')
      .leftJoinAndSelect('consultation.patient', 'patient')
      .getMany();
  }

  async findOne(id: number): Promise<Consultation> {
    const consultations = await this.consultationsRepository
      .createQueryBuilder('consultation')
      .leftJoinAndSelect('consultation.user', 'user')
      .leftJoinAndSelect('consultation.schedule', 'schedule')
      .leftJoinAndSelect('consultation.patient', 'patient')
      .where('consultation.id = :id', { id })
      .getOne();

    if (!consultations) {
      throw new NotFoundException(`Consulta com id ${id} não foi encontrado`);
    }

    return consultations;
  }

  async update(
    id: number,
    updateConsultationDto: UpdateConsultationDto,
  ): Promise<Consultation> {
    const consultation = await this.findOne(id);
    this.consultationsRepository.merge(consultation, updateConsultationDto);
    return await this.consultationsRepository.save(consultation);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.consultationsRepository.delete(id);
  }
}
