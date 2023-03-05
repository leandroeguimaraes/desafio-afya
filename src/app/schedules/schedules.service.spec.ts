import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { SchedulesService } from './schedules.service';
import { Schedule } from './entities/schedule.entity';
import * as moment from 'moment-timezone';
import {
  DATE_SERVICE,
  IDateService,
} from 'src/infra/date/interface/date.interface';
import { MomentDateService } from 'src/infra/date/moment-date.service';

describe('SchedulesService', () => {
  let schedulesService: SchedulesService;
  let schedulesRepository: Repository<Schedule>;
  let dateService: IDateService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        SchedulesService,
        {
          provide: getRepositoryToken(Schedule),
          useClass: Repository,
        },
        {
          provide: DATE_SERVICE,
          useClass: MomentDateService,
        },
      ],
    }).compile();

    schedulesService = moduleRef.get<SchedulesService>(SchedulesService);
    schedulesRepository = moduleRef.get<Repository<Schedule>>(
      getRepositoryToken(Schedule),
    );
    dateService = moduleRef.get<IDateService>(DATE_SERVICE);
  });

  describe('create', () => {
    it('should create a new schedule', async () => {
      const createScheduleDto: CreateScheduleDto = {
        userId: 1,
        patientId: 2,
        date: new Date('2023-03-17'),
      };

      const currentDate = moment.utc('2023-03-05T18:00:00.000Z').toDate();
      const dateUTC = moment.utc('2023-03-07T18:00:00.000Z').toDate();

      jest.spyOn(dateService, 'currentUTCDate').mockReturnValue(currentDate);
      jest.spyOn(dateService, 'getUTCDate').mockReturnValue(dateUTC);

      const existingSchedulePatient = null;
      const existingUserSchedule = null;
      const existingUserPatientSchedule = null;

      jest
        .spyOn(schedulesRepository, 'findOne')
        .mockImplementationOnce(() => Promise.resolve(existingSchedulePatient))
        .mockImplementationOnce(() => Promise.resolve(existingUserSchedule))
        .mockImplementationOnce(() =>
          Promise.resolve(existingUserPatientSchedule),
        );

      const newSchedule = new Schedule();
      newSchedule.id = 1;
      newSchedule.userId = 1;
      newSchedule.patientId = 2;
      newSchedule.date = new Date('2023-03-15T14:00:00.000Z');
      newSchedule.createdAt = new Date();
      newSchedule.updatedAt = new Date();
      newSchedule.deletedAt = new Date();
      newSchedule.user = null;
      newSchedule.patient = null;
      newSchedule.consultations = [];

      jest.spyOn(schedulesRepository, 'create').mockReturnValue(newSchedule);
      jest.spyOn(schedulesRepository, 'save').mockResolvedValue(newSchedule);

      const result = await schedulesService.create(createScheduleDto);

      expect(result).toEqual(newSchedule);
      expect(schedulesRepository.findOne).toHaveBeenCalledTimes(3);
      expect(schedulesRepository.create).toHaveBeenCalledWith(
        createScheduleDto,
      );
      expect(schedulesRepository.save).toHaveBeenCalledWith(newSchedule);
    });
    it('should throw a ConflictException when the schedule date is in the past', async () => {
      const createScheduleDto = {
        userId: 1,
        patientId: 1,
        date: new Date('2023-01-01'),
      };

      const currentDate = moment.utc('2023-03-01T12:00:00Z').toDate();
      const dateUTC = moment.utc('2023-01-01T00:00:00Z').toDate();

      jest.spyOn(dateService, 'currentUTCDate').mockReturnValue(currentDate);
      jest.spyOn(dateService, 'getUTCDate').mockReturnValue(dateUTC);

      await expect(
        schedulesService.create(createScheduleDto),
      ).rejects.toThrowError(ConflictException);
    });
    it('should throw a ConflictException if there is already a schedule for the patient at that date', async () => {
      const createScheduleDto = {
        userId: 1,
        patientId: 1,
        date: new Date('2023-06-01'),
      };

      const currentDate = moment.utc('2023-03-05T18:00:00.000Z').toDate();
      const dateUTC = moment.utc('2023-03-07T18:00:00.000Z').toDate();

      jest.spyOn(dateService, 'currentUTCDate').mockReturnValue(currentDate);
      jest.spyOn(dateService, 'getUTCDate').mockReturnValue(dateUTC);

      const existingSchedulePatient = new Schedule();
      const existingUserSchedule = null;
      const existingUserPatientSchedule = null;

      jest
        .spyOn(schedulesRepository, 'findOne')
        .mockImplementationOnce(() => Promise.resolve(existingSchedulePatient))
        .mockImplementationOnce(() => Promise.resolve(existingUserSchedule))
        .mockImplementationOnce(() =>
          Promise.resolve(existingUserPatientSchedule),
        );

      await expect(schedulesService.create(createScheduleDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw a ConflictException if there is already a schedule for the user at that date', async () => {
      const createScheduleDto = {
        userId: 1,
        patientId: 1,
        date: new Date('2023-06-01'),
      };

      const currentDate = moment.utc('2023-03-05T18:00:00.000Z').toDate();
      const dateUTC = moment.utc('2023-03-07T18:00:00.000Z').toDate();

      jest.spyOn(dateService, 'currentUTCDate').mockReturnValue(currentDate);
      jest.spyOn(dateService, 'getUTCDate').mockReturnValue(dateUTC);

      const existingSchedulePatient = null;
      const existingUserSchedule = new Schedule();
      const existingUserPatientSchedule = null;

      jest
        .spyOn(schedulesRepository, 'findOne')
        .mockImplementationOnce(() => Promise.resolve(existingSchedulePatient))
        .mockImplementationOnce(() => Promise.resolve(existingUserSchedule))
        .mockImplementationOnce(() =>
          Promise.resolve(existingUserPatientSchedule),
        );

      await expect(schedulesService.create(createScheduleDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw a ConflictException if there is already a schedule for the user and patient at that date', async () => {
      const createScheduleDto = {
        userId: 1,
        patientId: 1,
        date: new Date('2023-06-01'),
      };

      const currentDate = moment.utc('2023-03-05T18:00:00.000Z').toDate();
      const dateUTC = moment.utc('2023-03-07T18:00:00.000Z').toDate();

      jest.spyOn(dateService, 'currentUTCDate').mockReturnValue(currentDate);
      jest.spyOn(dateService, 'getUTCDate').mockReturnValue(dateUTC);

      const existingSchedulePatient = null;
      const existingUserSchedule = null;
      const existingUserPatientSchedule = new Schedule();

      jest
        .spyOn(schedulesRepository, 'findOne')
        .mockImplementationOnce(() => Promise.resolve(existingSchedulePatient))
        .mockImplementationOnce(() => Promise.resolve(existingUserSchedule))
        .mockImplementationOnce(() =>
          Promise.resolve(existingUserPatientSchedule),
        );

      await expect(schedulesService.create(createScheduleDto)).rejects.toThrow(
        ConflictException,
      );
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
      const schedule1 = new Schedule();
      schedule1.id = 1;
      schedule1.userId = 1;
      schedule1.patientId = 1;
      schedule1.date = new Date();

      const queryBuilder: SelectQueryBuilder<Schedule> = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(schedule1),
      } as any;

      jest
        .spyOn(schedulesRepository, 'createQueryBuilder')
        .mockReturnValue(queryBuilder);

      const schedule = await schedulesService.findOne(schedule1.id);

      expect(schedule).toEqual(schedule1);
      expect(schedulesRepository.createQueryBuilder).toHaveBeenCalledTimes(1);
      expect(queryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'schedule.patient',
        'patient',
      );
      expect(queryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'schedule.user',
        'user',
      );
      expect(queryBuilder.where).toHaveBeenCalledTimes(1);
      expect(queryBuilder.getOne).toHaveBeenCalledTimes(1);
    });
  });

  it('should throw a NotFoundException if schedule does not exist', async () => {
    const schedule1 = new Schedule();
    schedule1.id = 1;
    schedule1.userId = 1;
    schedule1.patientId = 1;
    schedule1.date = new Date();

    const queryBuilder: SelectQueryBuilder<Schedule> = {
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockResolvedValue(null),
    } as any;

    jest
      .spyOn(schedulesRepository, 'createQueryBuilder')
      .mockReturnValue(queryBuilder);

    await expect(schedulesService.findOne(schedule1.id)).rejects.toThrow(
      NotFoundException,
    );
    expect(schedulesRepository.createQueryBuilder).toHaveBeenCalledTimes(1);
    expect(queryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
      'schedule.patient',
      'patient',
    );
    expect(queryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
      'schedule.user',
      'user',
    );
    expect(queryBuilder.where).toHaveBeenCalledTimes(1);
    expect(queryBuilder.getOne).toHaveBeenCalledTimes(1);
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

      jest.spyOn(schedulesService, 'findOne').mockResolvedValueOnce(schedule);

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
      schedule.date = new Date();

      const updateScheduleDto = {
        ...schedule,
        date: new Date('2021-01-01'),
      };

      jest.spyOn(schedulesService, 'findOne').mockImplementation(() => {
        throw new NotFoundException(`Agendamento não foi encontrado`);
      });

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
      jest.spyOn(schedulesService, 'findOne').mockImplementation(() => {
        throw new NotFoundException(`Agendamento não foi encontrado`);
      });

      await expect(schedulesService.remove(1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
