import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  CRYPT_SERVICE,
  ICryptService,
} from 'src/infra/crypt/interface/crypt.interface';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { EnumRole } from './enum/roles.enum';

describe('UsersService', () => {
  let usersService: UsersService;
  let userRepository: Repository<User>;
  let cryptService: ICryptService;

  const mockCryptService: ICryptService = {
    createHash: jest.fn(),
    compare: jest.fn(),
  };
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: CRYPT_SERVICE,
          useValue: mockCryptService,
        },
      ],
    }).compile();

    usersService = moduleRef.get<UsersService>(UsersService);
    userRepository = moduleRef.get<Repository<User>>(getRepositoryToken(User));
    cryptService = moduleRef.get<ICryptService>(CRYPT_SERVICE);
  });

  describe('create', () => {
    it('should create and return a user', async () => {
      const createUserDto = {
        name: 'Doctor',
        email: 'doctor@gmail.com',
        password: '!Teste123',
        role: EnumRole.DOCTOR,
      };
      const existingUser = undefined;

      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(existingUser);
      jest
        .spyOn(cryptService, 'createHash')
        .mockResolvedValue('hashedpassword');

      const expectedUser = new User();
      expectedUser.id = 1;
      expectedUser.name = createUserDto.name;
      expectedUser.email = createUserDto.email;
      expectedUser.password = 'hashedpassword';

      jest.spyOn(userRepository, 'create').mockReturnValue(expectedUser);
      jest.spyOn(userRepository, 'save').mockResolvedValue(expectedUser);

      const createdUser = await usersService.create(createUserDto);

      expect(createdUser).toEqual(expectedUser);
      expect(userRepository.findOneBy).toHaveBeenCalledWith({
        email: createUserDto.email,
      });
      expect(cryptService.createHash).toHaveBeenCalledWith(
        createUserDto.password,
        12,
      );
      expect(userRepository.create).toHaveBeenCalledWith({
        ...createUserDto,
        password: 'hashedpassword',
      });
      expect(userRepository.save).toHaveBeenCalledWith(expectedUser);
    });

    it('should throw a ConflictException when user already exists', async () => {
      const createUserDto = {
        name: 'Doctor',
        email: 'doctor@gmail.com',
        password: '!Teste123',
        role: EnumRole.DOCTOR,
      };

      const existingUser = new User();

      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(existingUser);

      await expect(usersService.create(createUserDto)).rejects.toThrow(
        ConflictException,
      );
      expect(userRepository.findOneBy).toHaveBeenCalledWith({
        email: createUserDto.email,
      });
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const user1 = new User();
      user1.id = 1;
      user1.email = 'test1@test.com';

      const user2 = new User();
      user2.id = 2;
      user2.email = 'test2@test.com';

      const users = [user1, user2];

      jest.spyOn(userRepository, 'find').mockResolvedValue(users);

      const allUsers = await usersService.findAll();

      expect(allUsers).toEqual(users);
      expect(userRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should find a user', async () => {
      const user = new User();
      user.id = 1;
      user.email = 'doctor@gmail.com';

      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(user);

      const result = await usersService.findOne(1);

      expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual(user);
    });

    it('should throw a NotFoundException if user does not exist', async () => {
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(null);

      await expect(usersService.findOne(1)).rejects.toThrow(NotFoundException);
      expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });
  });

  describe('findByEmail', () => {
    it('should return the user with the given email', async () => {
      const email = 'doctor@gmail.com';
      const user = new User();
      user.id = 1;
      user.email = email;

      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(user);

      const result = await usersService.findByEmail(email);

      expect(result).toEqual(user);
      expect(userRepository.findOneBy).toHaveBeenCalledWith({ email });
    });

    it('should throw a NotFoundException when user does not exist', async () => {
      const email = 'doctor@gmail.com';

      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(null);

      await expect(usersService.findByEmail(email)).rejects.toThrow(
        NotFoundException,
      );
      expect(userRepository.findOneBy).toHaveBeenCalledWith({ email });
    });
  });

  describe('update', () => {
    it('should update an existing user', async () => {
      const user = new User();
      user.id = 1;
      user.name = 'Doctor';
      user.email = 'doctor@gmail.com';
      user.role = EnumRole.DOCTOR;

      const updateUserDto = {
        ...user,
        name: 'Doctor Who',
      };

      jest.spyOn(userRepository, 'findOneBy').mockResolvedValueOnce(user);

      jest.spyOn(userRepository, 'merge').mockReturnValueOnce(user);
      const saveSpy = jest
        .spyOn(userRepository, 'save')
        .mockResolvedValueOnce(user);

      const result = await usersService.update(1, updateUserDto);

      expect(result).toEqual(user);
      expect(saveSpy).toHaveBeenCalledWith(user);
    });

    it('should throw a NotFoundException if user with given id is not found', async () => {
      const user = new User();
      user.id = 1;
      user.name = 'Doctor';
      user.email = 'doctor@gmail.com';
      user.role = EnumRole.DOCTOR;
      const updateUserDto = {
        ...user,
        name: 'Doctor Who',
      };

      jest.spyOn(userRepository, 'findOneBy').mockResolvedValueOnce(null);

      await expect(usersService.update(1, updateUserDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove an existing user', async () => {
      const user = new User();
      user.id = 1;
      user.name = 'Doctor';
      user.email = 'doctor@gmail.com';
      user.role = EnumRole.DOCTOR;

      const findOneSpy = jest
        .spyOn(usersService, 'findOne')
        .mockResolvedValueOnce(user);

      const deleteSpy = jest
        .spyOn(userRepository, 'delete')
        .mockResolvedValueOnce(undefined);

      await usersService.remove(1);

      expect(findOneSpy).toHaveBeenCalledWith(1);
      expect(deleteSpy).toHaveBeenCalledWith(user.id);
    });

    it('should throw a NotFoundException if the user does not exist', async () => {
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValueOnce(undefined);

      await expect(usersService.remove(1)).rejects.toThrow(NotFoundException);
    });
  });
});
