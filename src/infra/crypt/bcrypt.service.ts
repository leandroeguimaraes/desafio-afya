import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ICryptService } from 'src/infra/crypt/interface/crypt.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptService implements ICryptService {
  private readonly logger = new Logger(BcryptService.name);

  createHash(message: string, cost: number): any {
    try {
      return bcrypt.hashSync(message, cost);
    } catch (err) {
      this.logger.warn(`createHash - Erro ao criar ao encriptar`);
      throw new InternalServerErrorException(`Erro ao criar ao encriptar`);
    }
  }
  compare(data: string, encrypted: string): any {
    try {
      return bcrypt.compareSync(data, encrypted);
    } catch (err) {
      this.logger.warn(`compare - Erro ao comparar hashes`);
      throw new InternalServerErrorException(`Erro ao comparar hashes`);
    }
  }
}
