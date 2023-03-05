import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SchedulesController } from './schedules.controller';
import { SchedulesService } from './schedules.service';
import { Schedule } from './entities/schedule.entity';
import { JwtTokenModule } from 'src/infra/jwttoken/jwttoken.module';
import { DateModule } from 'src/infra/date/date.module';

@Module({
  imports: [TypeOrmModule.forFeature([Schedule]), JwtTokenModule, DateModule],
  controllers: [SchedulesController],
  providers: [SchedulesService],
})
export class SchedulesModule {}
