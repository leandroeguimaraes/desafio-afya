import { InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { BcryptService } from './bcrypt.service';
import * as bcrypt from 'bcrypt';

describe('BcryptService', () => {
  let bcryptService: BcryptService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BcryptService],
    }).compile();

    bcryptService = module.get<BcryptService>(BcryptService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('createHash', () => {
    it('should generate a hash correctly', async () => {
      const message = 'password123';
      const cost = 10;
      const hash = await bcryptService.createHash(message, cost);
      expect(hash).toBeDefined();
      expect(typeof hash).toBe('string');
    });
    it('should throw an InternalServerErrorException if an error occurs during hash creation', () => {
      jest.spyOn(bcrypt, 'hashSync').mockImplementation(() => {
        throw new Error();
      });

      expect(() => bcryptService.createHash('password123', 10)).toThrow(
        new InternalServerErrorException('Erro ao criar ao encriptar'),
      );
    });
  });
  describe('compare', () => {
    it('should return true when comparing equal hashes', async () => {
      const message = 'password';
      const hash = await bcryptService.createHash(message, 10);
      const result = await bcryptService.compare(message, hash);
      console.log(result);
      expect(result).toBe(true);
    });

    it('should return false when comparing different hashes', async () => {
      const message1 = 'password1';
      const message2 = 'password2';
      const hash = await bcryptService.createHash(message1, 10);

      const result = await bcryptService.compare(message2, hash);

      expect(result).toBe(false);
    });

    it('should throw an InternalServerErrorException when bcrypt.compareSync throws an error', async () => {
      jest.spyOn(bcrypt, 'compareSync').mockImplementation(() => {
        throw new Error();
      });

      const message = 'password';
      const hash = bcrypt.hashSync(message, 10);

      expect(() =>
        bcryptService.compare('invalid password', hash),
      ).toThrowError(
        new InternalServerErrorException('Erro ao comparar hashes'),
      );
    });
  });
});
