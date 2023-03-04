import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Consultation } from './entities/consultation.entity';
import { ConsultationsService } from './consultations.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { CreateConsultationDto } from './dto/create-consultation.dto';
import { UpdateConsultationDto } from './dto/update-consultation.dto';

describe('ConsultationsService', () => {
  let consultationsService: ConsultationsService;
  let consultationsRepository: Repository<Consultation>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ConsultationsService,
        {
          provide: getRepositoryToken(Consultation),
          useClass: Repository,
        },
      ],
    }).compile();
    consultationsService =
      moduleRef.get<ConsultationsService>(ConsultationsService);
    consultationsRepository = moduleRef.get<Repository<Consultation>>(
      getRepositoryToken(Consultation),
    );
  });

  describe('create', () => {
    it('should create and return a consultation', async () => {
      const createConsultationDto: CreateConsultationDto = {
        patientId: 1,
        scheduleId: 1,
        userId: 1,
        notes: 'Consulta inicial',
      };
      const existingConsultation = undefined;
      const expectedConsultation = new Consultation();
      expectedConsultation.id = 1;
      expectedConsultation.patientId = createConsultationDto.patientId;
      expectedConsultation.scheduleId = createConsultationDto.scheduleId;
      expectedConsultation.userId = createConsultationDto.userId;
      expectedConsultation.notes = createConsultationDto.notes;

      jest
        .spyOn(consultationsRepository, 'findOne')
        .mockResolvedValue(existingConsultation);

      jest
        .spyOn(consultationsRepository, 'create')
        .mockReturnValue(expectedConsultation);
      jest
        .spyOn(consultationsRepository, 'save')
        .mockResolvedValue(expectedConsultation);

      const createdConsultation = await consultationsService.create(
        createConsultationDto,
      );

      expect(createdConsultation).toEqual(expectedConsultation);
      expect(consultationsRepository.findOne).toHaveBeenCalledWith({
        where: {
          patientId: createConsultationDto.patientId,
          scheduleId: createConsultationDto.scheduleId,
        },
      });
      expect(consultationsRepository.save).toHaveBeenCalledWith(
        expectedConsultation,
      );
    });

    it('should throw a ConflictException when consultation already exists', async () => {
      const createConsultationDto: CreateConsultationDto = {
        patientId: 1,
        scheduleId: 1,
        userId: 1,
        notes: 'Consulta inicial',
      };

      const existingConsultation = new Consultation();

      jest
        .spyOn(consultationsRepository, 'findOne')
        .mockResolvedValue(existingConsultation);

      await expect(
        consultationsService.create(createConsultationDto),
      ).rejects.toThrow(ConflictException);
      expect(consultationsRepository.findOne).toHaveBeenCalledWith({
        where: {
          patientId: createConsultationDto.patientId,
          scheduleId: createConsultationDto.scheduleId,
        },
      });
    });
  });
  describe('findAll', () => {
    it('should return an array of consultations', async () => {
      const consultation = new Consultation();
      consultation.id = 1;
      consultation.userId = 1;
      consultation.patientId = 1;
      consultation.scheduleId = 1;
      consultation.notes = 'Notes';

      const consultation2 = new Consultation();
      consultation2.id = 2;
      consultation2.userId = 2;
      consultation2.patientId = 2;
      consultation2.scheduleId = 2;
      consultation2.notes = null;

      const consultations = [consultation, consultation2];

      const queryBuilder: SelectQueryBuilder<Consultation> = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(consultations),
      } as any;

      jest
        .spyOn(consultationsRepository, 'createQueryBuilder')
        .mockReturnValue(queryBuilder);

      const allConsultations = await consultationsService.findAll();

      expect(allConsultations).toEqual(consultations);
      expect(consultationsRepository.createQueryBuilder).toHaveBeenCalledTimes(
        1,
      );
      expect(queryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'consultation.user',
        'user',
      );
      expect(queryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'consultation.schedule',
        'schedule',
      );
      expect(queryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'consultation.patient',
        'patient',
      );
      expect(queryBuilder.getMany).toHaveBeenCalledTimes(1);
    });
  });
  describe('findOne', () => {
    it('should find a consultation', async () => {
      const consultation1 = new Consultation();
      consultation1.id = 1;
      consultation1.userId = 1;
      consultation1.patientId = 1;
      consultation1.scheduleId = 1;
      consultation1.notes = 'Some notes';

      const queryBuilder: SelectQueryBuilder<Consultation> = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(consultation1),
      } as any;

      jest
        .spyOn(consultationsRepository, 'createQueryBuilder')
        .mockReturnValue(queryBuilder);

      const consultation = await consultationsService.findOne(consultation1.id);

      expect(consultation).toEqual(consultation);
      expect(consultationsRepository.createQueryBuilder).toHaveBeenCalledTimes(1);
      expect(queryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'consultation.patient',
        'patient',
      );
      expect(queryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'consultation.user',
        'user',
      );
      expect(queryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'consultation.schedule',
        'schedule',
      );
      expect(queryBuilder.where).toHaveBeenCalledTimes(1);
      expect(queryBuilder.getOne).toHaveBeenCalledTimes(1);

    });

    it('should throw a NotFoundException if consultation does not exist', async () => {
      const consultation1 = new Consultation();
      consultation1.id = 1;
      consultation1.userId = 1;
      consultation1.patientId = 1;
      consultation1.scheduleId = 1;
      consultation1.notes = 'Some notes';

      const queryBuilder: SelectQueryBuilder<Consultation> = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      } as any;

      jest
        .spyOn(consultationsRepository, 'createQueryBuilder')
        .mockReturnValue(queryBuilder);

      await expect(consultationsService.findOne(consultation1.id)).rejects.toThrow(
        NotFoundException,
      );

      expect(consultationsRepository.createQueryBuilder).toHaveBeenCalledTimes(1);
      expect(queryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'consultation.patient',
        'patient',
      );
      expect(queryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'consultation.user',
        'user',
      );
      expect(queryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'consultation.schedule',
        'schedule',
      );
      expect(queryBuilder.where).toHaveBeenCalledTimes(1);
      expect(queryBuilder.getOne).toHaveBeenCalledTimes(1);
    });
  });
  describe('update', () => {
    const consultation = new Consultation();
    consultation.id = 1;
    consultation.userId = 1;
    consultation.patientId = 1;
    consultation.scheduleId = 1;
    consultation.notes = 'Some notes';

    const updateConsultationDto: UpdateConsultationDto = {
      ...consultation,
      notes: 'Consulta atualizada',
    };

    it('should update an existing consultation', async () => {
      const consultation = new Consultation();
      consultation.id = 1;
      consultation.userId = 1;
      consultation.patientId = 1;
      consultation.scheduleId = 1;
      consultation.notes = 'Consulta original';

      jest
        .spyOn(consultationsService, 'findOne')
        .mockResolvedValueOnce(consultation);
      jest
        .spyOn(consultationsRepository, 'merge')
        .mockReturnValueOnce(consultation);
      const saveSpy = jest
        .spyOn(consultationsRepository, 'save')
        .mockResolvedValueOnce(consultation);

      const result = await consultationsService.update(
        1,
        updateConsultationDto,
      );

      expect(result).toEqual(consultation);
      expect(saveSpy).toHaveBeenCalledWith(consultation);
    });

    it('should throw a NotFoundException if consultation with given id is not found', async () => {
      jest
        .spyOn(consultationsService, 'findOne')
        .mockImplementation(() => {
          throw new NotFoundException(`Consulta não foi encontrado`);
        });

      await expect(
        consultationsService.update(1, updateConsultationDto),
      ).rejects.toThrow(NotFoundException);
    });
  });
  describe('remove', () => {
    it('should remove an existing consultation', async () => {
      const consultation = new Consultation();
      consultation.id = 1;
      consultation.userId = 1;
      consultation.patientId = 1;
      consultation.scheduleId = 1;
      consultation.createdAt = new Date();
      consultation.updatedAt = new Date();
      consultation.deletedAt = null;

      const findOneSpy = jest
        .spyOn(consultationsService, 'findOne')
        .mockResolvedValueOnce(consultation);
      const deleteSpy = jest
        .spyOn(consultationsRepository, 'delete')
        .mockResolvedValueOnce(undefined);

      await consultationsService.remove(1);

      expect(findOneSpy).toHaveBeenCalledWith(1);
      expect(deleteSpy).toHaveBeenCalledWith(consultation.id);
    });

    it('should throw a NotFoundException if the consultation does not exist', async () => {
      jest
        .spyOn(consultationsService, 'findOne')
        .mockImplementation(() => {
          throw new NotFoundException(`Consulta não foi encontrado`);
        });

      await expect(consultationsService.remove(1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
