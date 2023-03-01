import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { IUniqueIDService } from './interface/uniqueid.interface';

@Injectable()
export class UuidService implements IUniqueIDService {
  private readonly logger = new Logger(UuidService.name);

  createUniqueId(): any {
    try {
      const id: string = uuid();
      return id;
    } catch (err) {
      this.logger.warn(`createHash - Erro ao criar string única`);
      throw new InternalServerErrorException(`Erro ao criar string única`);
    }
  }
}
