import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CreatePatientDto } from './dto/create-patient.dto';
import { Patient } from './entities/patient.entity';
import { PatientsService } from './patients.service';

describe('PatientsService', () => {
  let patientsService: PatientsService;
  let patientsRepository: Repository<Patient>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        PatientsService,
        {
          provide: getRepositoryToken(Patient),
          useClass: Repository,
        },
      ],
    }).compile();

    patientsService = moduleRef.get<PatientsService>(PatientsService);
    patientsRepository = moduleRef.get<Repository<Patient>>(
      getRepositoryToken(Patient),
    );
  });

  describe('create', () => {
    it('should create and return a patient', async () => {
      const createPatientDto: CreatePatientDto = {
        userId: 1,
        name: 'Patient Patient',
        phone: '21998876655',
        email: 'patient@gmail.com',
        birthDate: new Date(),
        gender: 'Masculino',
        height: 1.8,
        weight: 75,
      };
      const existingPatient = undefined;

      const expectedPatient = new Patient();
      expectedPatient.id = 1;
      expectedPatient.name = createPatientDto.name;
      expectedPatient.email = createPatientDto.email;

      jest
        .spyOn(patientsRepository, 'findOneBy')
        .mockResolvedValue(existingPatient);

      jest.spyOn(patientsRepository, 'create').mockReturnValue(expectedPatient);
      jest.spyOn(patientsRepository, 'save').mockResolvedValue(expectedPatient);

      const createdUser = await patientsService.create(createPatientDto);

      expect(createdUser).toEqual(expectedPatient);
      expect(patientsRepository.findOneBy).toHaveBeenCalledWith({
        email: createPatientDto.email,
      });
      expect(patientsRepository.save).toHaveBeenCalledWith(expectedPatient);
    });

    it('should throw a ConflictException when patient already exists', async () => {
      const createPatientDto: CreatePatientDto = {
        userId: 1,
        name: 'Patient Patient',
        phone: '21998876655',
        email: 'patient@gmail.com',
        birthDate: new Date(),
        gender: 'Masculino',
        height: 1.8,
        weight: 75,
      };

      const existingPatient = new Patient();

      jest
        .spyOn(patientsRepository, 'findOneBy')
        .mockResolvedValue(existingPatient);

      await expect(patientsService.create(createPatientDto)).rejects.toThrow(
        ConflictException,
      );
      expect(patientsRepository.findOneBy).toHaveBeenCalledWith({
        email: createPatientDto.email,
      });
    });
  });

  describe('findAll', () => {
    it('should return an array of patients including deleted ones when activeOnly is false', async () => {
      const patient1 = new Patient();
      patient1.id = 1;
      patient1.email = 'test1@test.com';

      const patient2 = new Patient();
      patient2.id = 2;
      patient2.email = 'test2@test.com';
      patient2.deletedAt = new Date();

      const patients = [patient1, patient2];

      const queryBuilder: SelectQueryBuilder<Patient> = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(patients),
      } as any;

      jest
        .spyOn(patientsRepository, 'createQueryBuilder')
        .mockReturnValue(queryBuilder);

      const allPatients = await patientsService.findAll(false);

      expect(allPatients).toEqual(patients);
      expect(patientsRepository.createQueryBuilder).toHaveBeenCalledTimes(1);
      expect(queryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'patient.user',
        'user',
      );
      expect(queryBuilder.getMany).toHaveBeenCalledTimes(1);
      expect(queryBuilder.andWhere).not.toHaveBeenCalled();
      expect(queryBuilder.orWhere).not.toHaveBeenCalled();
    });

    it('should return an array of patients without deleted ones when activeOnly is true', async () => {
      const patient1 = new Patient();
      patient1.id = 1;
      patient1.email = 'test1@test.com';

      const patient2 = new Patient();
      patient2.id = 2;
      patient2.email = 'test2@test.com';
      patient2.deletedAt = new Date();

      const patients = [patient1];

      const queryBuilder: SelectQueryBuilder<Patient> = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(patients),
      } as any;

      jest
        .spyOn(patientsRepository, 'createQueryBuilder')
        .mockReturnValue(queryBuilder);

      const allPatients = await patientsService.findAll(true);

      expect(allPatients).toEqual(patients);
      expect(patientsRepository.createQueryBuilder).toHaveBeenCalledTimes(1);
      expect(queryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'patient.user',
        'user',
      );
      expect(queryBuilder.getMany).toHaveBeenCalledTimes(1);
      expect(queryBuilder.andWhere).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should find a patient', async () => {
      const patient1 = new Patient();
      patient1.id = 1;
      patient1.email = 'test1@test.com';


      const queryBuilder: SelectQueryBuilder<Patient> = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(patient1),
      } as any;

      jest
        .spyOn(patientsRepository, 'createQueryBuilder')
        .mockReturnValue(queryBuilder);

      const patient = await patientsService.findOne(patient1.id);

      expect(patient).toEqual(patient1);
      expect(patientsRepository.createQueryBuilder).toHaveBeenCalledTimes(1);
      expect(queryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'patient.user',
        'user',
      );
      expect(queryBuilder.where).toHaveBeenCalled();
      expect(queryBuilder.getOne).toHaveBeenCalledTimes(1);
    });

    it('should throw a NotFoundException if patient does not exist', async () => {
      const patient1 = new Patient();
      patient1.id = 1;
      patient1.email = 'test1@test.com';


      const queryBuilder: SelectQueryBuilder<Patient> = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      } as any;

      jest
        .spyOn(patientsRepository, 'createQueryBuilder')
        .mockReturnValue(queryBuilder);


      await expect(patientsService.findOne(patient1.id)).rejects.toThrow(
        NotFoundException,
      );
      expect(patientsRepository.createQueryBuilder).toHaveBeenCalledTimes(1);
      expect(queryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'patient.user',
        'user',
      );
      expect(queryBuilder.where).toHaveBeenCalledTimes(1);
      expect(queryBuilder.getOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('should update an existing patient', async () => {
      const patient = new Patient();
      patient.id = 1;
      patient.userId = 1;
      patient.name = 'Patient Pat';
      patient.email = 'patient@gmail.com';
      patient.phone = '21998876655';
      patient.birthDate = new Date();
      patient.gender = 'Masculino';
      patient.height = 1.8;
      patient.weight = 75;

      const updatePatientDto = {
        ...patient,
        name: 'Patient Patient',
      };

      jest
        .spyOn(patientsService, 'findOne')
        .mockResolvedValueOnce(patient);

      jest.spyOn(patientsRepository, 'merge').mockReturnValueOnce(patient);
      const saveSpy = jest
        .spyOn(patientsRepository, 'save')
        .mockResolvedValueOnce(patient);

      const result = await patientsService.update(1, updatePatientDto);

      expect(result).toEqual(patient);
      expect(saveSpy).toHaveBeenCalledWith(patient);
    });

    it('should throw a NotFoundException if patient with given id is not found', async () => {
      const patient = new Patient();
      patient.id = 1;
      patient.userId = 1;
      patient.name = 'Patient Pat';
      patient.email = 'patient@gmail.com';
      patient.phone = '21998876655';
      patient.birthDate = new Date();
      patient.gender = 'Masculino';
      patient.height = 1.8;
      patient.weight = 75;

      const updatePatientDto = {
        ...patient,
        name: 'Patient Patient',
      };

      jest.spyOn(patientsService, 'findOne').mockImplementation(() => {
        throw new NotFoundException(`Paciente não foi encontrado`);
      });

      await expect(patientsService.update(1, updatePatientDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove an existing patient', async () => {
      const patient = new Patient();
      patient.id = 1;
      patient.userId = 1;
      patient.name = 'Patient Pat';
      patient.email = 'patient@gmail.com';
      patient.phone = '21998876655';
      patient.birthDate = new Date();
      patient.gender = 'Masculino';
      patient.height = 1.8;
      patient.weight = 75;

      const findOneSpy = jest
        .spyOn(patientsService, 'findOne')
        .mockResolvedValueOnce(patient);

      const deleteSpy = jest
        .spyOn(patientsRepository, 'delete')
        .mockResolvedValueOnce(undefined);

      await patientsService.remove(1);

      expect(findOneSpy).toHaveBeenCalledWith(1);
      expect(deleteSpy).toHaveBeenCalledWith(patient.id);
    });

    it('should throw a NotFoundException if the patient does not exist', async () => {
      jest
        .spyOn(patientsService, 'findOne')
        .mockImplementation(() => {
          throw new NotFoundException(`Paciente não foi encontrado`);
        });

      await expect(patientsService.remove(1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('removeLGPD', () => {
    const patient = new Patient();
    patient.id = 1;
    patient.userId = 1;
    patient.name = 'Patient Pat';
    patient.email = 'patient@gmail.com';
    patient.phone = '21998876655';
    patient.birthDate = new Date();
    patient.gender = 'Masculino';
    patient.height = 1.8;
    patient.weight = 75;
    patient.deletedAt = null;

    beforeEach(() => {
      jest.spyOn(patientsService, 'findOne').mockResolvedValue(patient);
      jest.spyOn(patientsRepository, 'save').mockResolvedValue(null);
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should throw NotFoundException when patient is not found', async () => {
      jest.spyOn(patientsService, 'findOne').mockImplementation(() => {
        throw new NotFoundException(`Paciente com id ${id} não foi encontrado`);
      });
      const id = 1;

      await expect(patientsService.removeLGPD(id)).rejects.toThrow(
        new NotFoundException(`Paciente com id ${id} não foi encontrado`),
      );
    });

    it('should set deletedAt and nullify personal data fields', async () => {
      const id = 1;

      await patientsService.removeLGPD(id);

      expect(patientsService.findOne).toHaveBeenCalledTimes(1);
      expect(patientsService.findOne).toHaveBeenCalledWith(id);

      expect(patientsRepository.save).toHaveBeenCalledTimes(1);
      expect(patientsRepository.save).toHaveBeenCalledWith({
        ...patient,
        deletedAt: expect.any(Date),
        name: null,
        email: null,
        phone: null,
        birthDate: null,
        gender: null,
        height: null,
        weight: null,
      });
    });
  });
});
