import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = moduleRef.get<AuthController>(AuthController);
    authService = moduleRef.get<AuthService>(AuthService);
  });

  describe('login', () => {
    it('should call authService.login and return access_token and refresh_token', async () => {
      const mockUser = { email: 'doctor@gmail.com', id: '123', role: 'doctor' };
      const mockLoginResult = {
        access_token: 'access_token',
        refresh_token: 'refresh_token',
      };

      jest.spyOn(authService, 'login').mockResolvedValueOnce(mockLoginResult);

      const req = { user: mockUser };

      const result = await controller.login(req);

      expect(authService.login).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockLoginResult);
    });
  });
});
