import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CRYPT_SERVICE } from 'src/infra/crypt/interface/crypt.interface';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { EnumRole } from './enum/roles.enum';
import { UpdateUserDto } from './dto/update-user.dto';
import { JWTTOKEN_SERVICE } from 'src/infra/jwttoken/interface/jwttoken.interface';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  const mockUser: User = {
    id: 1,
    name: 'Doctor',
    email: 'doctor@gmail.com',
    password: '!Teste123',
    role: EnumRole.DOCTOR,
    createdAt: new Date().toDateString(),
    updatedAt: new Date().toDateString(),
    deletedAt: null,
    patients: null,
    schedules: []
  };

  const mockCryptService = () => ({
    createHash: jest.fn(),
  });

  const mockJwtTokenService = () => ({
    sign: jest.fn(),
    decode: jest.fn(),
    verify: jest.fn(),
  });

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: CRYPT_SERVICE,
          useValue: mockCryptService(),
        },
        {
          provide: JWTTOKEN_SERVICE,
          useValue: mockJwtTokenService(),
        },
        UsersService,
      ],
    }).compile();

    usersController = moduleRef.get<UsersController>(UsersController);
    usersService = moduleRef.get<UsersService>(UsersService);
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto = {
        name: 'Doctor',
        email: 'doctor@gmail.com',
        password: '!Teste123',
        role: EnumRole.DOCTOR,
      };

      jest.spyOn(usersService, 'create').mockResolvedValueOnce(mockUser);

      expect(await usersController.create(createUserDto)).toEqual(mockUser);
      expect(usersService.create).toHaveBeenCalledWith(createUserDto);
    });

    it('should throw a ConflictException if user already exists', async () => {
      const createUserDto = {
        name: 'Doctor',
        email: 'doctor@gmail.com',
        password: '!Teste123',
        role: EnumRole.DOCTOR,
      };

      jest.spyOn(usersService, 'create').mockRejectedValueOnce(() => {
        throw new ConflictException(
          `Usuário com email ${createUserDto.email} já existe`,
        );
      });

      await expect(usersController.create(createUserDto)).rejects.toThrow(
        new ConflictException(
          `Usuário com email ${createUserDto.email} já existe`,
        ),
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const mockUsers: User[] = [mockUser];

      jest.spyOn(usersService, 'findAll').mockResolvedValueOnce(mockUsers);

      expect(await usersController.findAll()).toEqual(mockUsers);
      expect(usersService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user', async () => {
      const user = new User();
      user.id = 1;
      user.email = 'doctor@gmail.com';

      jest.spyOn(usersService, 'findOne').mockResolvedValue(user);

      expect(await usersController.findOne('1')).toBe(user);
    });

    it('should throw a NotFoundException if user does not exist', async () => {
      jest.spyOn(usersService, 'findOne').mockRejectedValueOnce(() => {
        throw new NotFoundException(`Usuário com id 2 não foi encontrado`);
      });

      await expect(usersController.findOne('2')).rejects.toThrow(
        new NotFoundException(`Usuário com id 2 não foi encontrado`),
      );
    });
  });

  describe('findByEmail', () => {
    it('should return user by email', async () => {
      const user = new User();
      user.id = 1;
      user.email = 'doctor@gmail.com';
      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(user);

      const result = await usersController.findByEmail(user.email);
      expect(result).toEqual(user);
    });

    it('should return 404 if user not found', async () => {
      const email = 'doctor@gmail.com';
      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(null);

      try {
        await usersController.findByEmail(email);
      } catch (error) {
        expect(error.status).toEqual(404);
        expect(error.message).toEqual('User not found');
      }
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto: UpdateUserDto = {
        name: 'Updated Name',
      };

      const user = new User();
      user.id = 1;
      user.email = 'doctor@gmail.com';
      user.name = 'doctor';

      jest.spyOn(usersService, 'update').mockResolvedValue(user);

      expect(await usersController.update('1', updateUserDto)).toBe(user);
    });

    it('should throw a NotFoundException if user does not exist', async () => {
      const updateUserDto: UpdateUserDto = {
        name: 'Updated Name',
      };
      const id = '1';

      jest.spyOn(usersService, 'update').mockRejectedValueOnce(() => {
        throw new NotFoundException(`Usuário com id 2 não foi encontrado`);
      });

      await expect(usersController.update(id, updateUserDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const user = new User();
      user.id = 1;
      user.email = 'doctor@gmail.com';

      jest.spyOn(usersService, 'remove').mockResolvedValue(undefined);

      await usersController.remove('1');
    });

    it('should throw a NotFoundException if user does not exist', async () => {
      jest.spyOn(usersService, 'remove').mockRejectedValueOnce(() => {
        throw new NotFoundException(`Usuário com id 1 não foi encontrado`);
      });

      await expect(usersController.remove('1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
