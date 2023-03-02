import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/users/entities/user.entity';
import { UsersService } from 'src/app/users/users.service';
import { CRYPT_SERVICE, ICryptService } from 'src/infra/crypt/interface/crypt.interface';
import { JWTTOKEN_SERVICE, IJwtTokenService } from 'src/infra/jwttoken/interface/jwttoken.interface';
import { Repository } from 'typeorm';
import { LocalStrategy } from './local.strategy';

describe('LocalStrategy', () => {
    let localStrategy: LocalStrategy;
    let authService: AuthService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                LocalStrategy,
                AuthService,
                UsersService,
                { provide: CRYPT_SERVICE, useValue: { compare: jest.fn() } },
                { provide: JWTTOKEN_SERVICE, useValue: { sign: jest.fn() } },
                {
                    provide: getRepositoryToken(User),
                    useClass: Repository,
                },
            ],
        }).compile();

        localStrategy = module.get<LocalStrategy>(LocalStrategy);
        authService = module.get<AuthService>(AuthService);
    });

    describe('validate', () => {
        it('should return a user object if email and password are valid', async () => {
            const email = 'doctor@gmail.com';
            const password = 'testpassword';

            const mockUser = {
                id: 1,
                email: email,
                password: password,
            };

            jest.spyOn(authService, 'validateUser').mockImplementation(
                async (email: string, password: string) => {
                    if (email === mockUser.email && password === mockUser.password) {
                        return mockUser;
                    }
                    return null;
                },
            );

            const result = await localStrategy.validate(email, password);
            expect(result).toEqual(mockUser);
        });

        it('should throw an UnauthorizedException if email or password is invalid', async () => {
            const email = 'doctor@gmail.com';
            const password = 'testpassword';

            jest.spyOn(authService, 'validateUser').mockResolvedValue(null);

            await expect(localStrategy.validate(email, password)).rejects.toThrow(UnauthorizedException);
        });
    });
});
