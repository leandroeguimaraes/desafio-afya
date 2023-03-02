import { Reflector } from '@nestjs/core';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { EnumRole } from 'src/app/users/enum/roles.enum';
import {
    IJwtTokenService,
    JWTTOKEN_SERVICE,
} from 'src/infra/jwttoken/interface/jwttoken.interface';
import { RolesGuard } from './roles.guard';

const mockReflector = () => ({
    getAllAndOverride: jest.fn(),
});

const mockJwtTokenService = () => ({
    decode: jest.fn(),
});

describe('RolesGuard', () => {
    let guard: RolesGuard;
    let reflector: Reflector;
    let jwtTokenService: IJwtTokenService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                RolesGuard,
                { provide: Reflector, useFactory: mockReflector },
                { provide: JWTTOKEN_SERVICE, useFactory: mockJwtTokenService },
            ],
        }).compile();

        guard = module.get<RolesGuard>(RolesGuard);
        reflector = module.get<Reflector>(Reflector);
        jwtTokenService = module.get<IJwtTokenService>(JWTTOKEN_SERVICE);
    });

    it('should be defined', () => {
        expect(guard).toBeDefined();
    });

    it('should return true if no roles are required', () => {
        const context = {
            getHandler: jest.fn(),
            getClass: jest.fn(),
            switchToHttp: jest.fn(),
        };
        const result = guard.canActivate(context as unknown as ExecutionContext);
        expect(result).toBe(true);
    });

    it('should rejects if authorization header is missing', async () => {
        const context = {
            getHandler: jest.fn(),
            getClass: jest.fn(),
            switchToHttp: jest.fn(() => ({
                getRequest: jest.fn(() => ({})),
            })),
        };
        await expect(guard.canActivate(context as unknown as ExecutionContext)).rejects.toHaveReturned;
    });

    it('should rejects if role is not allowed', () => {
        const context = {
            getHandler: jest.fn(),
            getClass: jest.fn(),
            switchToHttp: jest.fn(() => ({
                getRequest: jest.fn(() => ({
                    headers: { authorization: 'Bearer token' },
                })),
            })),
        };
        const decodedToken = { role: 'user' };
        jest.spyOn(jwtTokenService, 'decode').mockReturnValue(decodedToken);
        jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([
            EnumRole.ADMIN,
            EnumRole.DOCTOR,
        ]);
        expect(() => {
            guard.canActivate(context as unknown as ExecutionContext);
        }).rejects.toHaveReturned;
    });

    it('should return true if role is allowed', () => {
        const context = {
            getHandler: jest.fn(),
            getClass: jest.fn(),
            switchToHttp: jest.fn(() => ({
                getRequest: jest.fn(() => ({
                    headers: { authorization: 'Bearer token' },
                })),
            })),
        };
        const decodedToken = { role: EnumRole.DOCTOR };
        jest.spyOn(jwtTokenService, 'decode').mockReturnValue(decodedToken);
        jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([
            EnumRole.ADMIN,
            EnumRole.DOCTOR,
        ]);
        const result = guard.canActivate(context as unknown as ExecutionContext);
        expect(result).toBe(true);
    });
});
