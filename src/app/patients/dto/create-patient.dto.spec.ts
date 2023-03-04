import { validateSync } from 'class-validator';
import { CreatePatientDto } from './create-patient.dto';
import { EnumGender } from '../enum/gender.enum';
import { plainToClass } from 'class-transformer';

describe('CreatePatientDto', () => {
  it('should validate a valid dto', () => {
    const patientDto = new CreatePatientDto();
    patientDto.userId = 1;
    patientDto.name = 'Doctor House Doe';
    patientDto.phone = '21987654321';
    patientDto.email = 'jdoctor@gmail.com';
    patientDto.birthDate = new Date('2000-01-01');
    patientDto.gender = EnumGender.MASCULINO;
    patientDto.height = 1.75;
    patientDto.weight = 70.5;

    const errors = validateSync(patientDto);
    expect(errors.length).toBe(0);
  });

  it('should not validate an invalid dto with invalid userId', () => {
    const patientDto = new CreatePatientDto();
    patientDto.userId = -1; // userId deve ser maior ou igual a 0

    const errors = validateSync(patientDto);
    expect(errors.length).toBeGreaterThan(0);
  });

  describe('name', () => {
    it('should not validate an invalid dto with invalid name', () => {
      const patientDto = new CreatePatientDto();
      patientDto.userId = 1;
      patientDto.name = '123'; // name deve conter apenas letras e espaços
      patientDto.phone = '21987654321';
      patientDto.email = 'jdoctor@gmail.com';
      patientDto.birthDate = new Date('2000-01-01');
      patientDto.gender = EnumGender.MASCULINO;
      patientDto.height = 1.75;
      patientDto.weight = 70.5;

      const errors = validateSync(patientDto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should not validate an invalid dto with name with more than 50 chars', () => {
      const patientDto = new CreatePatientDto();
      patientDto.userId = 1;
      patientDto.name = 'a'.repeat(51);
      patientDto.phone = '21987654321';
      patientDto.email = 'jdoctor@gmail.com';
      patientDto.birthDate = new Date('2000-01-01');
      patientDto.gender = EnumGender.MASCULINO;
      patientDto.height = 1.75;
      patientDto.weight = 70.5;

      const errors = validateSync(patientDto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should transform name to lowercase and apply trim', () => {
      const patientDto = plainToClass(CreatePatientDto, {
        userId: 1,
        name: '   Doctor House ',
        phone: '21987654321',
        email: 'jdoctor@gmail.com',
        birthDate: new Date('2000-01-01'),
        gender: EnumGender.MASCULINO,
        height: 1.75,
        weight: 70.5,
      });

      const errors = validateSync(patientDto);
      expect(errors.length).toBe(0);
      expect(patientDto.name).toBe('doctor house');
    });
  });
  describe('phone', () => {
    it('should validate a valid phone number', () => {
      const patientDto = new CreatePatientDto();
      patientDto.phone = ' 21987654321';

      const errors = validateSync(patientDto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should transform phone and apply trim', () => {
      const patientDto = plainToClass(CreatePatientDto, {
        userId: 1,
        name: 'Doctor House',
        phone: '   21987654321  ',
        email: 'jdoctor@gmail.com',
        birthDate: new Date('2000-01-01'),
        gender: EnumGender.MASCULINO,
        height: 1.75,
        weight: 70.5,
      });

      const errors = validateSync(patientDto);
      expect(errors.length).toBe(0);
      expect(patientDto.phone).toBe('21987654321');
    });
    it('should not validate an invalid phone number with more than 11 digits', () => {
      const patientDto = new CreatePatientDto();
      patientDto.phone = '219876543211';

      const errors = validateSync(patientDto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should not validate an invalid phone number with non-numeric characters', () => {
      const patientDto = new CreatePatientDto();
      patientDto.phone = '21a9876543';

      const errors = validateSync(patientDto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should not validate an invalid phone number with less than 11 digits', () => {
      const patientDto = new CreatePatientDto();
      patientDto.phone = '219876543';

      const errors = validateSync(patientDto);
      expect(errors.length).toBeGreaterThan(0);
    });
  });
  describe('email', () => {
    it('should validate a valid email with no spaces', () => {
      const userDto = plainToClass(CreatePatientDto, {
        userId: 1,
        name: 'Doctor House',
        phone: '21987654321',
        email: 'doctor@gmail.com',
        birthDate: new Date('2000-01-01'),
        gender: EnumGender.MASCULINO,
        height: 1.75,
        weight: 70.5,
      });

      const classObject = plainToClass(CreatePatientDto, userDto);
      const errors = validateSync(classObject);

      expect(errors.length).toBe(0);
    });

    it('should validate a valid email with spaces before and after', () => {
      const userDto = plainToClass(CreatePatientDto, {
        userId: 1,
        name: 'Doctor House',
        phone: '21987654321',
        email: '     DOCTOR@gmail.com        ',
        birthDate: new Date('2000-01-01'),
        gender: EnumGender.MASCULINO,
        height: 1.75,
        weight: 70.5,
      });
      const errors = validateSync(userDto);
      expect(errors.length).toBe(0);
      expect(userDto.email).toBe('doctor@gmail.com');
    });

    it('should not validate an empty email', () => {
      const dto = new CreatePatientDto();
      dto.email = '';

      const classObject = plainToClass(CreatePatientDto, dto);
      const errors = validateSync(classObject);

      expect(errors.length).toBeGreaterThan(0);
    });

    it('should not validate an invalid email', () => {
      const dto = new CreatePatientDto();
      dto.email = 'invalidemail';

      const classObject = plainToClass(CreatePatientDto, dto);
      const errors = validateSync(classObject);

      expect(errors.length).toBeGreaterThan(0);
    });

    it('should not validate an email with more than 100 characters', () => {
      const dto = new CreatePatientDto();
      dto.email = 'a'.repeat(101) + '@example.com';

      const classObject = plainToClass(CreatePatientDto, dto);
      const errors = validateSync(classObject);

      expect(errors.length).toBeGreaterThan(0);
    });
  });
  describe('birthDate', () => {
    it('should validate a dto with valid birthDate', () => {
      const userDto = plainToClass(CreatePatientDto, {
        userId: 1,
        name: 'Doctor House',
        phone: '21987654321',
        email: 'doctor@gmail.com',
        birthDate: '1990-01-01',
        gender: EnumGender.MASCULINO,
        height: 1.75,
        weight: 70.5,
      });
      const errors = validateSync(userDto);

      expect(errors.length).toBe(0);
      expect(userDto.birthDate).toBeInstanceOf(Date);
    });

    it('should not validate an invalid dto with invalid birthDate', () => {
      const userDto = plainToClass(CreatePatientDto, {
        userId: 1,
        name: 'Doctor House',
        phone: '21987654321',
        email: 'doctor@gmail.com',
        birthDate: '2023/01/2023',
        gender: EnumGender.MASCULINO,
        height: 1.75,
        weight: 70.5,
      });

      const errors = validateSync(userDto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isDate');
    });
  });
  describe('gender', () => {
    it('should not validate an invalid dto with empty gender', () => {
      const userDto = plainToClass(CreatePatientDto, {
        userId: 1,
        name: 'Doctor House',
        phone: '21987654321',
        email: 'doctor@gmail.com',
        birthDate: '2023-01-01',
        gender: '',
        height: 1.75,
        weight: 70.5,
      });

      const errors = validateSync(userDto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toEqual('gender');
    });

    it('should not validate an invalid dto with gender different from the allowed ones', () => {
      const userDto = plainToClass(CreatePatientDto, {
        userId: 1,
        name: 'Doctor House',
        phone: '21987654321',
        email: 'doctor@gmail.com',
        birthDate: '2023-01-01',
        gender: 'other',
        height: 1.75,
        weight: 70.5,
      });

      const errors = validateSync(userDto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toEqual('gender');
    });

    it('should validate a valid dto with a valid gender', () => {
      const userDto = plainToClass(CreatePatientDto, {
        userId: 1,
        name: 'Doctor House',
        phone: '21987654321',
        email: 'doctor@gmail.com',
        birthDate: '2023-01-01',
        gender: EnumGender.MASCULINO,
        height: 1.75,
        weight: 70.5,
      });

      const errors = validateSync(userDto);

      expect(errors.length).toBe(0);
    });
  });

  describe('height', () => {
    it('should validate a valid dto with valid height', () => {
      const patientDto = new CreatePatientDto();
      patientDto.userId = 1;
      patientDto.name = 'John Doe';
      patientDto.phone = '1112345678';
      patientDto.email = 'johndoe@example.com';
      patientDto.birthDate = new Date('2000-01-01');
      patientDto.gender = EnumGender.MASCULINO;
      patientDto.height = 1.75;
      patientDto.weight = 70.5;

      const errors = validateSync(patientDto);
      expect(errors.length).toBe(0);
    });

    it('should not validate an invalid dto with invalid height', () => {
      const patientDto = new CreatePatientDto();
      patientDto.userId = 1;
      patientDto.name = 'John Doe';
      patientDto.phone = '1112345678';
      patientDto.email = 'johndoe@example.com';
      patientDto.birthDate = new Date('2000-01-01');
      patientDto.gender = EnumGender.MASCULINO;
      patientDto.height = -1;
      patientDto.weight = 70.5;

      const errors = validateSync(patientDto);
      expect(errors.length).toBeGreaterThan(0);
    });
  });
  describe('weight', () => {
    it('should validate a valid dto with valid weight', () => {
      const patientDto = new CreatePatientDto();
      patientDto.userId = 1;
      patientDto.name = 'John Doe';
      patientDto.phone = '1112345678';
      patientDto.email = 'johndoe@example.com';
      patientDto.birthDate = new Date('2000-01-01');
      patientDto.gender = EnumGender.MASCULINO;
      patientDto.height = 1.75;
      patientDto.weight = 70.5;

      const errors = validateSync(patientDto);
      expect(errors.length).toBe(0);
    });

    it('should not validate an invalid dto with invalid height', () => {
      const patientDto = new CreatePatientDto();
      patientDto.userId = 1;
      patientDto.name = 'John Doe';
      patientDto.phone = '1112345678';
      patientDto.email = 'johndoe@example.com';
      patientDto.birthDate = new Date('2000-01-01');
      patientDto.gender = EnumGender.MASCULINO;
      patientDto.height = 1.75;
      patientDto.weight = -1;

      const errors = validateSync(patientDto);
      expect(errors.length).toBeGreaterThan(0);
    });
  });
});
