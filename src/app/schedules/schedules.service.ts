import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { Schedule } from './entities/schedule.entity';

@Injectable()
export class SchedulesService {
  constructor(
    @InjectRepository(Schedule)
    private schedulesRepository: Repository<Schedule>,
  ) { }

  async create(createScheduleDto: CreateScheduleDto): Promise<Schedule> {
    const { userId, date } = createScheduleDto;
    const existingSchedule = await this.schedulesRepository.findOne({
      where: { date, userId },
    });

    if (existingSchedule) {
      throw new ConflictException(`Agendamento já existe`);
    }
    const schedule = this.schedulesRepository.create(createScheduleDto);
    return await this.schedulesRepository.save(schedule);
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
      throw new NotFoundException(`Agendamento com id ${id} não foi encontrado`);
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
