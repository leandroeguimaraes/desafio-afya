import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
    patientsRepository = moduleRef.get<Repository<Patient>>(getRepositoryToken(Patient));
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
        height: 1.80,
        weight: 75,
      };
      const existingPatient = undefined;

      const expectedPatient = new Patient();
      expectedPatient.id = 1;
      expectedPatient.name = createPatientDto.name;
      expectedPatient.email = createPatientDto.email;

      jest.spyOn(patientsRepository, 'findOneBy').mockResolvedValue(existingPatient);

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
        height: 1.80,
        weight: 75,
      };

      const existingPatient = new Patient();

      jest.spyOn(patientsRepository, 'findOneBy').mockResolvedValue(existingPatient);

      await expect(patientsService.create(createPatientDto)).rejects.toThrow(
        ConflictException,
      );
      expect(patientsRepository.findOneBy).toHaveBeenCalledWith({
        email: createPatientDto.email,
      });
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const user1 = new Patient();
      user1.id = 1;
      user1.email = 'test1@test.com';

      const user2 = new Patient();
      user2.id = 2;
      user2.email = 'test2@test.com';

      const users = [user1, user2];

      jest.spyOn(patientsRepository, 'find').mockResolvedValue(users);

      const allUsers = await patientsService.findAll();

      expect(allUsers).toEqual(users);
      expect(patientsRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should find a patient', async () => {
      const patient = new Patient();
      patient.id = 1;
      patient.email = 'patient@gmail.com';

      jest.spyOn(patientsRepository, 'findOneBy').mockResolvedValue(patient);

      const result = await patientsService.findOne(1);

      expect(patientsRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual(patient);
    });

    it('should throw a NotFoundException if patient does not exist', async () => {
      jest.spyOn(patientsRepository, 'findOneBy').mockResolvedValue(null);

      await expect(patientsService.findOne(1)).rejects.toThrow(NotFoundException);
      expect(patientsRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
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
      patient.height = 1.80;
      patient.weight = 75;

      const updatePatientDto = {
        name: 'Patient Patient',
      };

      jest.spyOn(patientsRepository, 'findOneBy').mockResolvedValueOnce(patient);

      jest.spyOn(patientsRepository, 'merge').mockReturnValueOnce(patient);
      const saveSpy = jest
        .spyOn(patientsRepository, 'save')
        .mockResolvedValueOnce(patient);

      const result = await patientsService.update(1, updatePatientDto);

      expect(result).toEqual(patient);
      expect(saveSpy).toHaveBeenCalledWith(patient);
    });

    it('should throw a NotFoundException if patient with given id is not found', async () => {
      const updatePatientDto = {
        name: 'Patient Patient',
      };

      jest.spyOn(patientsRepository, 'findOneBy').mockResolvedValueOnce(null);

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
      patient.height = 1.80;
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
      jest.spyOn(patientsRepository, 'findOneBy').mockResolvedValueOnce(undefined);

      await expect(patientsService.remove(1)).rejects.toThrow(NotFoundException);
    });
  });
});
