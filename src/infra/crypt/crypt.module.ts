import { Module } from '@nestjs/common';
import { BcryptService } from './bcrypt.service';
import { CRYPT_SERVICE } from './interface/crypt.interface';

const CryptService = {
  provide: CRYPT_SERVICE,
  useClass: BcryptService,
};

@Module({
  providers: [CryptService],
  exports: [CryptService],
})
export class CryptModule {}
