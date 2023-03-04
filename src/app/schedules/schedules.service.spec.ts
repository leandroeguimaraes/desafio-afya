import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { SchedulesService } from './schedules.service';
import { Schedule } from './entities/schedule.entity';

describe('SchedulesService', () => {
  let schedulesService: SchedulesService;
  let schedulesRepository: Repository<Schedule>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        SchedulesService,
        {
          provide: getRepositoryToken(Schedule),
          useClass: Repository,
        },
      ],
    }).compile();

    schedulesService = moduleRef.get<SchedulesService>(SchedulesService);
    schedulesRepository = moduleRef.get<Repository<Schedule>>(
      getRepositoryToken(Schedule),
    );
  });

  describe('create', () => {
    it('should create and return a schedule', async () => {
      const createScheduleDto: CreateScheduleDto = {
        patientId: 1,
        date: new Date(),
        userId: 1,
      };
      const existingSchedule = undefined;

      const expectedSchedule = new Schedule();
      expectedSchedule.id = 1;
      expectedSchedule.date = createScheduleDto.date;
      expectedSchedule.userId = createScheduleDto.userId;

      jest
        .spyOn(schedulesRepository, 'findOne')
        .mockResolvedValue(existingSchedule);

      jest
        .spyOn(schedulesRepository, 'create')
        .mockReturnValue(expectedSchedule);
      jest
        .spyOn(schedulesRepository, 'save')
        .mockResolvedValue(expectedSchedule);

      const createdSchedule = await schedulesService.create(createScheduleDto);

      expect(createdSchedule).toEqual(expectedSchedule);
      expect(schedulesRepository.findOne).toHaveBeenCalledWith({
        where: {
          date: createScheduleDto.date,
          userId: createScheduleDto.userId,
        },
      });
      expect(schedulesRepository.save).toHaveBeenCalledWith(expectedSchedule);
    });

    it('should throw a ConflictException when schedule already exists', async () => {
      const createScheduleDto: CreateScheduleDto = {
        patientId: 1,
        userId: 1,
        date: new Date(),
      };

      const existingSchedule = new Schedule();

      jest
        .spyOn(schedulesRepository, 'findOne')
        .mockResolvedValue(existingSchedule);

      await expect(schedulesService.create(createScheduleDto)).rejects.toThrow(
        ConflictException,
      );
      expect(schedulesRepository.findOne).toHaveBeenCalledWith({
        where: {
          date: createScheduleDto.date,
          userId: createScheduleDto.userId,
        },
      });
    });
  });

  describe('findAll', () => {
    it('should return an array of schedules', async () => {
      const schedule = new Schedule();
      schedule.userId = 1;
      schedule.patientId = 1;
      schedule.date = new Date();

      const schedule2 = new Schedule();
      schedule2.userId = 2;
      schedule2.patientId = 2;
      schedule2.date = new Date('2020-01-01');

      const schedules = [schedule, schedule2];

      const queryBuilder: SelectQueryBuilder<Schedule> = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(schedules),
      } as any;

      jest
        .spyOn(schedulesRepository, 'createQueryBuilder')
        .mockReturnValue(queryBuilder);

      const allSchedules = await schedulesService.findAll();

      expect(allSchedules).toEqual(schedules);
      expect(schedulesRepository.createQueryBuilder).toHaveBeenCalledTimes(1);
      expect(queryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'schedule.patient',
        'patient',
      );
      expect(queryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'schedule.user',
        'user',
      );
      expect(queryBuilder.getMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should find a schedule', async () => {
      const schedule = new Schedule();
      schedule.id = 1;
      schedule.userId = 1;
      schedule.patientId = 1;
      schedule.date = new Date();

      jest.spyOn(schedulesRepository, 'findOneBy').mockResolvedValue(schedule);

      const result = await schedulesService.findOne(1);

      expect(schedulesRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual(schedule);
    });

    it('should throw a NotFoundException if schedule does not exist', async () => {
      jest.spyOn(schedulesRepository, 'findOneBy').mockResolvedValue(null);

      await expect(schedulesService.findOne(1)).rejects.toThrow(
        NotFoundException,
      );
      expect(schedulesRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });
  });

  describe('update', () => {
    it('should update an existing schedule', async () => {
      const schedule = new Schedule();
      schedule.id = 1;
      schedule.userId = 1;
      schedule.patientId = 1;
      schedule.date = new Date();

      const updateScheduleDto = {
        ...schedule,
        date: new Date('2021-01-01'),
      };

      jest
        .spyOn(schedulesRepository, 'findOneBy')
        .mockResolvedValueOnce(schedule);

      jest.spyOn(schedulesRepository, 'merge').mockReturnValueOnce(schedule);
      const saveSpy = jest
        .spyOn(schedulesRepository, 'save')
        .mockResolvedValueOnce(schedule);

      const result = await schedulesService.update(1, updateScheduleDto);

      expect(result).toEqual(schedule);
      expect(saveSpy).toHaveBeenCalledWith(schedule);
    });

    it('should throw a NotFoundException if schedule with given id is not found', async () => {
      const schedule = new Schedule();
      schedule.id = 1;
      schedule.userId = 1;
      schedule.patientId = 1;
      schedule.date = new Date()

      const updateScheduleDto = {
        ...schedule,
        date: new Date('2021-01-01'),
      };

      jest.spyOn(schedulesRepository, 'findOneBy').mockResolvedValueOnce(null);

      await expect(
        schedulesService.update(1, updateScheduleDto),
      ).rejects.toThrow(NotFoundException);
    });
  });
  describe('remove', () => {
    it('should remove an existing schedule', async () => {
      const schedule = new Schedule();
      schedule.id = 1;
      schedule.userId = 1;
      schedule.patientId = 1;
      schedule.date = new Date();

      const findOneSpy = jest
        .spyOn(schedulesService, 'findOne')
        .mockResolvedValueOnce(schedule);

      const deleteSpy = jest
        .spyOn(schedulesRepository, 'delete')
        .mockResolvedValueOnce(undefined);

      await schedulesService.remove(1);

      expect(findOneSpy).toHaveBeenCalledWith(1);
      expect(deleteSpy).toHaveBeenCalledWith(schedule.id);
    });

    it('should throw a NotFoundException if the schedule does not exist', async () => {
      jest
        .spyOn(schedulesRepository, 'findOneBy')
        .mockResolvedValueOnce(undefined);

      await expect(schedulesService.remove(1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
