import { InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { JwttokenService } from './jwttoken.service';

describe('JwttokenService', () => {
  let jwtTokenService: JwttokenService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwttokenService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            decode: jest.fn(),
            verify: jest.fn(),
          },
        },
      ],
    }).compile();

    jwtTokenService = module.get<JwttokenService>(JwttokenService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('sign', () => {
    it('should sign and return token correctly', async () => {
      const obj = { id: 1, name: 'Doctor House' };
      const expiresIn = '1h';

      const expectedToken = 'abc.def.ghi';

      jest.spyOn(jwtService, 'sign').mockReturnValue(expectedToken);

      const token = jwtTokenService.sign(obj, expiresIn);

      expect(token).toBe(expectedToken);
      expect(jwtService.sign).toHaveBeenCalledWith(obj, { expiresIn });
    });

    it('should throw InternalServerErrorException if jwtService throws', async () => {
      const obj = { id: 1, name: 'Doctor House' };
      const expiresIn = '1h';

      jest.spyOn(jwtService, 'sign').mockImplementation(() => {
        throw new Error();
      });

      expect(() => jwtTokenService.sign(obj, expiresIn)).toThrow(
        InternalServerErrorException,
      );
      expect(jwtService.sign).toHaveBeenCalledWith(obj, { expiresIn });
    });
  });

  describe('decode', () => {
    it('should decode and return token correctly', async () => {
      const token = 'abc.def.ghi';
      const expectedDecoded = { id: 1, name: 'Doctor House' };

      jest.spyOn(jwtService, 'decode').mockReturnValue(expectedDecoded);

      const decoded = jwtTokenService.decode(token);

      expect(decoded).toBe(expectedDecoded);
      expect(jwtService.decode).toHaveBeenCalledWith(token);
    });

    it('should throw InternalServerErrorException if jwtService throws', async () => {
      const token = 'abc.def.ghi';

      jest.spyOn(jwtService, 'decode').mockImplementation(() => {
        throw new Error();
      });

      expect(() => jwtTokenService.decode(token)).toThrow(
        InternalServerErrorException,
      );
      expect(jwtService.decode).toHaveBeenCalledWith(token);
    });
  });
  describe('verify', () => {
    it('should return the decoded token if it is valid', () => {
      const token = 'valid-token';
      const decoded = { id: 123 };
      jest.spyOn(jwtService, 'verify').mockImplementation(() => decoded);

      const result = jwtTokenService.verify(token);

      expect(result).toBe(decoded);
      expect(jwtService.verify).toHaveBeenCalledWith(token);
    });

    it('should throw an InternalServerErrorException if an error occurs during token verification', () => {
      const token = 'invalid-token';
      jest.spyOn(jwtService, 'verify').mockImplementation(() => {
        throw new Error();
      });

      expect(() => jwtTokenService.verify(token)).toThrow(
        new InternalServerErrorException('Erro ao verificar token'),
      );
    });
  });
});
