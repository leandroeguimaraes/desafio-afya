import { Test, TestingModule } from '@nestjs/testing';
import { PatientsController } from './patients.controller';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { Patient } from './entities/patient.entity';
import { JWTTOKEN_SERVICE } from 'src/infra/jwttoken/interface/jwttoken.interface';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('PatientsController', () => {
  let patientsController: PatientsController;
  let patientsService: PatientsService;

  const mockPatient: Patient = {
    id: 1,
    userId: 1,
    name: 'Patient Patient',
    phone: '21998876655',
    email: 'patient@gmail.com',
    birthDate: new Date(),
    gender: 'Masculino',
    height: 1.8,
    weight: 75,
    createdAt: new Date().toDateString(),
    updatedAt: new Date().toDateString(),
    deletedAt: null,
    user: null,
    schedules: [],
    consultations: [],
  };

  const mockJwtTokenService = () => ({
    sign: jest.fn(),
    decode: jest.fn(),
    verify: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PatientsController],
      providers: [
        {
          provide: PatientsService,
          useValue: {
            create: jest.fn(() => Promise.resolve(mockPatient)),
            findAll: jest.fn(() => Promise.resolve([mockPatient])),
            findOne: jest.fn(() => Promise.resolve(mockPatient)),
            update: jest.fn(() => Promise.resolve(mockPatient)),
            remove: jest.fn(() => Promise.resolve()),
          },
        },
        {
          provide: JWTTOKEN_SERVICE,
          useValue: mockJwtTokenService(),
        },
      ],
    }).compile();

    patientsController = module.get<PatientsController>(PatientsController);
    patientsService = module.get<PatientsService>(PatientsService);
  });

  describe('create', () => {
    it('should create a patient', async () => {
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

      jest.spyOn(patientsService, 'create').mockResolvedValueOnce(mockPatient);

      expect(await patientsController.create(createPatientDto)).toEqual(
        mockPatient,
      );
      expect(patientsService.create).toHaveBeenCalledWith(createPatientDto);
    });

    it('should throw a ConflictException if patient already exists', async () => {
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

      jest.spyOn(patientsService, 'create').mockRejectedValueOnce(() => {
        throw new ConflictException(
          `Paciente com email ${createPatientDto.email} já existe`,
        );
      });

      await expect(patientsController.create(createPatientDto)).rejects.toThrow(
        new ConflictException(
          `Paciente com email ${createPatientDto.email} já existe`,
        ),
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of patients', async () => {
      const mockPatients: Patient[] = [mockPatient];

      jest
        .spyOn(patientsService, 'findAll')
        .mockResolvedValueOnce(mockPatients);

      expect(await patientsController.findAll()).toEqual(mockPatients);
      expect(patientsService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a patient', async () => {
      const patient = new Patient();
      patient.id = 1;
      patient.email = 'patient@gmail.com';

      jest.spyOn(patientsService, 'findOne').mockResolvedValue(patient);

      expect(await patientsController.findOne('1')).toBe(patient);
    });

    it('should throw a NotFoundException if patient does not exist', async () => {
      jest.spyOn(patientsService, 'findOne').mockRejectedValueOnce(() => {
        throw new NotFoundException(`Paciente com id 2 não foi encontrado`);
      });

      await expect(patientsController.findOne('2')).rejects.toThrow(
        new NotFoundException(`Paciente com id 2 não foi encontrado`),
      );
    });
  });
  describe('update', () => {
    it('should update a patient', async () => {
      const updatePatientDto: UpdatePatientDto = {
        name: 'Updated Name',
      };

      const patient = new Patient();
      patient.id = 1;
      patient.email = 'patient@gmail.com';
      patient.name = 'patient';

      jest.spyOn(patientsService, 'update').mockResolvedValue(patient);

      expect(await patientsController.update('1', updatePatientDto)).toBe(
        patient,
      );
    });

    it('should throw a NotFoundException if patient does not exist', async () => {
      const updatePatientDto: UpdatePatientDto = {
        name: 'Updated Name',
      };
      const id = '1';

      jest.spyOn(patientsService, 'update').mockRejectedValueOnce(() => {
        throw new NotFoundException(`Paciente com id 2 não foi encontrado`);
      });

      await expect(
        patientsController.update(id, updatePatientDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a patient', async () => {
      const id = '1';

      jest.spyOn(patientsService, 'remove').mockResolvedValueOnce();

      await patientsController.remove(id);
      expect(patientsService.remove).toHaveBeenCalledWith(Number(id));
    });

    it('should throw a NotFoundException if patient does not exist', async () => {
      jest.spyOn(patientsService, 'remove').mockRejectedValueOnce(() => {
        throw new NotFoundException(`Paciente com id 1 não foi encontrado`);
      });

      await expect(patientsController.remove('1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
