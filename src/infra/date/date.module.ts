import { Module } from '@nestjs/common';
import { DATE_SERVICE } from './interface/date.interface';
import { MomentDateService } from './moment-date.service';

const DateService = {
  provide: DATE_SERVICE,
  useClass: MomentDateService,
};

@Module({
  providers: [DateService],
  exports: [DateService],
})
export class DateModule {}
