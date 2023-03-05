import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DATE_SERVICE,
  IDateService,
} from 'src/infra/date/interface/date.interface';
import { Repository } from 'typeorm';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { Schedule } from './entities/schedule.entity';

@Injectable()
export class SchedulesService {
  constructor(
    @InjectRepository(Schedule)
    private schedulesRepository: Repository<Schedule>,
    @Inject(DATE_SERVICE) private dateService: IDateService,
  ) {}

  async create(createScheduleDto: CreateScheduleDto): Promise<Schedule> {
    const { userId, patientId, date } = createScheduleDto;

    const currentDate = this.dateService.currentUTCDate();
    const dateUTC = this.dateService.getUTCDate(date);

    if (this.dateService.isBeforeDay(dateUTC, currentDate)) {
      throw new ConflictException('Não é possível agendar uma data passada');
    }

    const existingSchedulePatient = await this.schedulesRepository.findOne({
      where: { patientId, date },
    });
    if (existingSchedulePatient) {
      throw new ConflictException(
        'Já existe um agendamento para este paciente nesta data e hora.',
      );
    }

    const existingUserSchedule = await this.schedulesRepository.findOne({
      where: { userId, date },
    });
    if (existingUserSchedule) {
      throw new ConflictException(
        'Já existe um agendamento para este usuário nesta data e hora.',
      );
    }

    const existingUserPatientSchedule = await this.schedulesRepository.findOne({
      where: { userId, patientId, date },
    });
    if (existingUserPatientSchedule) {
      throw new ConflictException(
        'Já existe um agendamento para este usuário e paciente nesta data e hora.',
      );
    }

    const newSchedule = this.schedulesRepository.create(createScheduleDto);
    return await this.schedulesRepository.save(newSchedule);
  }

  async findAll(): Promise<Schedule[]> {
    return this.schedulesRepository
      .createQueryBuilder('schedule')
      .leftJoinAndSelect('schedule.user', 'user')
      .leftJoinAndSelect('schedule.patient', 'patient')
      .getMany();
  }
  async findOne(id: number): Promise<Schedule> {
    const schedule = await this.schedulesRepository
      .createQueryBuilder('schedule')
      .leftJoinAndSelect('schedule.user', 'user')
      .leftJoinAndSelect('schedule.patient', 'patient')
      .where('schedule.id = :id', { id })
      .getOne();

    if (!schedule) {
      throw new NotFoundException(
        `Agendamento com id ${id} não foi encontrado`,
      );
    }

    return schedule;
  }

  async update(
    id: number,
    updateScheduleDto: UpdateScheduleDto,
  ): Promise<Schedule> {
    const schedule = await this.findOne(id);
    this.schedulesRepository.merge(schedule, updateScheduleDto);
    return await this.schedulesRepository.save(schedule);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.schedulesRepository.delete(id);
  }
}
