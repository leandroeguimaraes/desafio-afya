import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SchedulesController } from './schedules.controller';
import { SchedulesService } from './schedules.service';
import { Schedule } from './entities/schedule.entity';
import { JwtTokenModule } from 'src/infra/jwttoken/jwttoken.module';
import { DateModule } from 'src/infra/date/date.module';
import { Consultation } from '../consultations/entities/consultation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Schedule]),
    TypeOrmModule.forFeature([Consultation]),
    JwtTokenModule,
    DateModule],
  controllers: [SchedulesController],
  providers: [SchedulesService],
})
export class SchedulesModule { }
