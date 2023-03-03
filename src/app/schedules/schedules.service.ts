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
  ) {}

  async create(createScheduleDto: CreateScheduleDto): Promise<Schedule> {
    const { date } = createScheduleDto;
    const existingUser = await this.schedulesRepository.findOneBy({ date });

    if (existingUser) {
      throw new ConflictException(
        `Agendamento com data ${createScheduleDto.date} já existe`,
      );
    }
    const schedule = this.schedulesRepository.create(createScheduleDto);
    return await this.schedulesRepository.save(schedule);
  }

  async findAll(): Promise<Schedule[]> {
    return this.schedulesRepository
      .createQueryBuilder('schedule')
      .leftJoinAndSelect('schedule.patient', 'patient')
      .getMany();
  }
  async findOne(id: number): Promise<Schedule> {
    const schedule = await this.schedulesRepository.findOneBy({ id });
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
