import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { User } from 'src/app/users/entities/user.entity';
import { UsersService } from 'src/app/users/users.service';
import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
    let jwtStrategy: JwtStrategy;
    let usersService: UsersService;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                JwtStrategy,
                {
                    provide: ConfigService,
                    useValue: {
                        get: jest.fn(() => 'test'),
                    },
                },
                {
                    provide: UsersService,
                    useValue: {
                        findOne: jest.fn(),
                    },
                },
            ],
        }).compile();

        jwtStrategy = moduleRef.get<JwtStrategy>(JwtStrategy);
        usersService = moduleRef.get<UsersService>(UsersService);
    });

    it('should be defined', () => {
        expect(jwtStrategy).toBeDefined();
    });

    it('should return a user object if payload contains a valid sub (id)', async () => {
        const payload = { sub: 1 };
        const user = new User();
        user.id = 1;
        user.email = 'doctor@gmail.com';
        jest.spyOn(usersService, 'findOne').mockResolvedValue(user);

        const result = await jwtStrategy.validate(payload);

        expect(result).toEqual(user);
        expect(usersService.findOne).toHaveBeenCalledWith(payload.sub);
    });

    it('should throw an UnauthorizedException if user is not found', async () => {
        const payload = { sub: 1 };
        jest.spyOn(usersService, 'findOne').mockResolvedValue(null);

        await expect(jwtStrategy.validate(payload)).rejects.toThrow(
            UnauthorizedException,
        );
        expect(usersService.findOne).toHaveBeenCalledWith(payload.sub);
    });
});
