import { Module } from '@nestjs/common';
import { UNIQUE_ID_SERVICE } from './interface/uniqueid.interface';
import { UuidService } from './uuid.service';

const UniqueIDService = {
    provide: UNIQUE_ID_SERVICE,
    useClass: UuidService
  };

@Module({
    providers: [UniqueIDService],
    exports:[UniqueIDService]
})
export class UniqueIDModule {}
