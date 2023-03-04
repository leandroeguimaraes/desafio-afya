import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ConsultationsController } from './consultations.controller';
import { ConsultationsService } from './consultations.service';
import { CreateConsultationDto } from './dto/create-consultation.dto';
import { UpdateConsultationDto } from './dto/update-consultation.dto';
import { Consultation } from './entities/consultation.entity';
import { JWTTOKEN_SERVICE } from 'src/infra/jwttoken/interface/jwttoken.interface';

describe('ConsultationsController', () => {
  let consultationsController: ConsultationsController;
  let consultationsService: ConsultationsService;

  const mockConsultation: Consultation = {
    id: 1,
    userId: 1,
    patientId: 1,
    scheduleId: 1,
    notes: 'Consulta de rotina',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    patient: null,
    user: null,
    schedule: null,
  };

  const mockJwtTokenService = () => ({
    sign: jest.fn(),
    decode: jest.fn(),
    verify: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConsultationsController],
      providers: [
        {
          provide: ConsultationsService,
          useValue: {
            create: jest.fn(() => Promise.resolve(mockConsultation)),
            findAll: jest.fn(() => Promise.resolve([mockConsultation])),
            findOne: jest.fn(() => Promise.resolve(mockConsultation)),
            update: jest.fn(() => Promise.resolve(mockConsultation)),
            remove: jest.fn(() => Promise.resolve()),
          },
        },
        {
          provide: JWTTOKEN_SERVICE,
          useValue: mockJwtTokenService(),
        },
      ],
    }).compile();

    consultationsController = module.get<ConsultationsController>(
      ConsultationsController,
    );
    consultationsService =
      module.get<ConsultationsService>(ConsultationsService);
  });

  describe('create', () => {
    it('should create a consultation', async () => {
      const createConsultationDto: CreateConsultationDto = {
        patientId: 1,
        userId: 1,
        scheduleId: 1,
        notes: 'Consulta de rotina',
      };

      jest
        .spyOn(consultationsService, 'create')
        .mockResolvedValueOnce(mockConsultation);

      expect(
        await consultationsController.create(createConsultationDto),
      ).toEqual(mockConsultation);
      expect(consultationsService.create).toHaveBeenCalledWith(
        createConsultationDto,
      );
    });

    it('should throw a ConflictException if schedule already exists', async () => {
      const createConsultationDto: CreateConsultationDto = {
        patientId: 1,
        userId: 1,
        scheduleId: 1,
        notes: 'Consulta de rotina',
      };

      jest
        .spyOn(consultationsService, 'create')
        .mockRejectedValueOnce(new ConflictException('Consulta já existe'));

      await expect(
        consultationsController.create(createConsultationDto),
      ).rejects.toThrow(new ConflictException('Consulta já existe'));
    });
  });
  describe('findAll', () => {
    it('should return an array of consultations', async () => {
      const mockConsultations: Consultation[] = [mockConsultation];

      jest
        .spyOn(consultationsService, 'findAll')
        .mockResolvedValueOnce(mockConsultations);

      expect(await consultationsController.findAll()).toEqual(
        mockConsultations,
      );
      expect(consultationsService.findAll).toHaveBeenCalled();
    });
  });
  describe('findOne', () => {
    it('should find a consultation by id', async () => {
      jest
        .spyOn(consultationsService, 'findOne')
        .mockResolvedValue(mockConsultation);

      expect(await consultationsController.findOne('1')).toBe(mockConsultation);
      expect(consultationsService.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw a NotFoundException when consultation is not found', async () => {
      jest.spyOn(consultationsService, 'findOne').mockRejectedValueOnce(() => {
        throw new NotFoundException(`Consulta com id 2 não foi encontrado`);
      });

      await expect(consultationsController.findOne('2')).rejects.toThrow(
        new NotFoundException(`Consulta com id 2 não foi encontrado`),
      );
    });
  });
  describe('update', () => {
    it('should update a consultation', async () => {
      const updateConsultationDto: UpdateConsultationDto = {
        notes: 'Novas notas sobre a consulta',
      };

      const updatedConsultation = {
        ...mockConsultation,
        ...updateConsultationDto,
        updatedAt: new Date(),
      };

      jest
        .spyOn(consultationsService, 'update')
        .mockResolvedValueOnce(updatedConsultation);

      expect(
        await consultationsController.update('1', updateConsultationDto),
      ).toBe(updatedConsultation);
      expect(consultationsService.update).toHaveBeenCalledWith(
        1,
        updateConsultationDto,
      );
    });

    it('should throw a NotFoundException if consultation does not exist', async () => {
      const updateConsultationDto: UpdateConsultationDto = {
        notes: 'Novas notas sobre a consulta',
      };

      jest.spyOn(consultationsService, 'update').mockRejectedValueOnce(() => {
        throw new NotFoundException(`Consulta com id 2 não foi encontrada`);
      });

      await expect(
        consultationsController.update('2', updateConsultationDto),
      ).rejects.toThrow(NotFoundException);
    });
  });
  describe('remove', () => {
    it('should remove a consultation', async () => {
      const id = '1';
      jest.spyOn(consultationsService, 'remove').mockResolvedValueOnce();

      await consultationsController.remove(id);

      expect(consultationsService.remove).toHaveBeenCalledWith(Number(id));
    });

    it('should throw a NotFoundException if consultation does not exist', async () => {
      const id = '1';
      jest.spyOn(consultationsService, 'remove').mockRejectedValueOnce(() => {
        throw new NotFoundException(`Consulta com id ${id} não foi encontrado`);
      });

      await expect(consultationsController.remove(id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
