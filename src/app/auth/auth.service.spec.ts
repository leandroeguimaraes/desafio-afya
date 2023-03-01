import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import {
  CRYPT_SERVICE,
  ICryptService,
} from 'src/infra/crypt/interface/crypt.interface';
import {
  IJwtTokenService,
  JWTTOKEN_SERVICE,
} from 'src/infra/jwttoken/interface/jwttoken.interface';

import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let cryptService: ICryptService;

  const mockJwtTokenService: IJwtTokenService = {
    sign: jest.fn(),
    decode: jest.fn(),
    verify: jest.fn(),
  };
  const mockCryptService: ICryptService = {
    createHash: jest.fn(),
    compare: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: CRYPT_SERVICE,
          useValue: mockCryptService,
        },
        {
          provide: JWTTOKEN_SERVICE,
          useValue: mockJwtTokenService,
        },
      ],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
    usersService = moduleRef.get<UsersService>(UsersService);
    cryptService = moduleRef.get<ICryptService>(CRYPT_SERVICE);
  });

  describe('validateUser', () => {
    it('should return null if user not found', async () => {
      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(null);
      const result = await authService.validateUser(
        'user@gmail.com',
        'password',
      );
      expect(result).toBeNull();
    });

    it('should return null if password is incorrect', async () => {
      const user = new User();
      user.id = 1;
      user.name = 'doctor';
      user.email = 'doctor@gmail.com';
      user.password = '!Teste123';

      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(user);
      jest.spyOn(cryptService, 'compare').mockReturnValue(false);
      const result = await authService.validateUser(user.email, '!Doctor1234');
      expect(result).toBeNull();
    });

    it('should return user without password if email and password are correct', async () => {
      const user = new User();
      user.id = 1;
      user.name = 'doctor';
      user.email = 'doctor@gmail.com';
      user.password = '!Teste123';

      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(user);
      jest.spyOn(authService['cryptService'], 'compare').mockReturnValue(true);
      const result = await authService.validateUser(user.email, user.password);
      expect(result).toBeDefined();
      expect(result).toHaveProperty('email', user.email);
      expect(result).toHaveProperty('name', user.name);
      expect(result).not.toHaveProperty('password');
    });
  });

  describe('login', () => {
    it('should return an object containing access_token and refresh_token', async () => {
      const user = { id: '123', email: 'doctor@gmail.com', role: 'user' };
      const result = await authService.login(user);
      expect(result).toBeDefined();
      expect(result).toHaveProperty('access_token');
      expect(result).toHaveProperty('refresh_token');
    });
  });
});
