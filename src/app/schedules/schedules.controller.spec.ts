import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { JWTTOKEN_SERVICE } from 'src/infra/jwttoken/interface/jwttoken.interface';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { Schedule } from './entities/schedule.entity';
import { SchedulesController } from './schedules.controller';
import { SchedulesService } from './schedules.service';

describe('SchedulesController', () => {
  let schedulesController: SchedulesController;
  let schedulesService: SchedulesService;

  const mockSchedule: Schedule = {
    id: 1,
    userId: 1,
    patientId: 1,
    date: new Date(),
    createdAt: new Date().toDateString(),
    updatedAt: new Date().toDateString(),
    deletedAt: null,
    patient: null,
    user: null,
    consultations: [],
  };

  const mockJwtTokenService = () => ({
    sign: jest.fn(),
    decode: jest.fn(),
    verify: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SchedulesController],
      providers: [
        {
          provide: SchedulesService,
          useValue: {
            create: jest.fn(() => Promise.resolve(mockSchedule)),
            findAll: jest.fn(() => Promise.resolve([mockSchedule])),
            findOne: jest.fn(() => Promise.resolve(mockSchedule)),
            update: jest.fn(() => Promise.resolve(mockSchedule)),
            remove: jest.fn(() => Promise.resolve()),
          },
        },
        {
          provide: JWTTOKEN_SERVICE,
          useValue: mockJwtTokenService(),
        },
      ],
    }).compile();

    schedulesController = module.get<SchedulesController>(SchedulesController);
    schedulesService = module.get<SchedulesService>(SchedulesService);
  });

  describe('create', () => {
    it('should create a schedule', async () => {
      const createScheduleDto: CreateScheduleDto = {
        patientId: 1,
        userId: 1,
        date: new Date(),
      };

      jest
        .spyOn(schedulesService, 'create')
        .mockResolvedValueOnce(mockSchedule);

      expect(await schedulesController.create(createScheduleDto)).toEqual(
        mockSchedule,
      );
      expect(schedulesService.create).toHaveBeenCalledWith(createScheduleDto);
    });

    it('should throw a ConflictException if schedule already exists', async () => {
      const createScheduleDto: CreateScheduleDto = {
        patientId: 1,
        userId: 1,
        date: new Date(),
      };

      jest.spyOn(schedulesService, 'create').mockRejectedValueOnce(() => {
        throw new ConflictException(`O agendamento já existe`);
      });

      await expect(
        schedulesController.create(createScheduleDto),
      ).rejects.toThrow(new ConflictException(`O agendamento já existe`));
    });
  });
  describe('findAll', () => {
    it('should return an array of schedules', async () => {
      const mockSchedules: Schedule[] = [mockSchedule];

      jest
        .spyOn(schedulesService, 'findAll')
        .mockResolvedValueOnce(mockSchedules);

      expect(await schedulesController.findAll()).toEqual(mockSchedules);
      expect(schedulesService.findAll).toHaveBeenCalled();
    });
  });
  describe('findOne', () => {
    it('should return a schedule', async () => {
      jest.spyOn(schedulesService, 'findOne').mockResolvedValue(mockSchedule);

      expect(await schedulesController.findOne('1')).toBe(mockSchedule);
      expect(schedulesService.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw a NotFoundException if schedule does not exist', async () => {
      jest.spyOn(schedulesService, 'findOne').mockRejectedValueOnce(() => {
        throw new NotFoundException(`Agendamento com id 2 não foi encontrado`);
      });

      await expect(schedulesController.findOne('2')).rejects.toThrow(
        new NotFoundException(`Agendamento com id 2 não foi encontrado`),
      );
    });
  });
  describe('update', () => {
    it('should update a schedule', async () => {
      const updateScheduleDto: UpdateScheduleDto = {
        date: new Date('2022-03-03T10:00:00Z'),
      };

      const updatedSchedule = {
        ...mockSchedule,
        ...updateScheduleDto,
        updatedAt: new Date().toDateString(),
      };

      jest
        .spyOn(schedulesService, 'update')
        .mockResolvedValueOnce(updatedSchedule);

      expect(await schedulesController.update('1', updateScheduleDto)).toBe(
        updatedSchedule,
      );
    });

    it('should throw a NotFoundException if schedule does not exist', async () => {
      const updateScheduleDto: UpdateScheduleDto = {
        date: new Date('2022-03-03T10:00:00Z'),
      };

      jest.spyOn(schedulesService, 'update').mockRejectedValueOnce(() => {
        throw new NotFoundException(`Agendamento com id 2 não foi encontrado`);
      });

      await expect(
        schedulesController.update('2', updateScheduleDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a schedule', async () => {
      const id = '1';
      jest.spyOn(schedulesService, 'remove').mockResolvedValueOnce();

      await schedulesController.remove(id);

      expect(schedulesService.remove).toHaveBeenCalledWith(Number(id));
    });

    it('should throw a NotFoundException if schedule does not exist', async () => {
      const id = '1';
      jest.spyOn(schedulesService, 'remove').mockRejectedValueOnce(() => {
        throw new NotFoundException(
          `Agendamento com id ${id} não foi encontrado`,
        );
      });

      await expect(schedulesController.remove(id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
