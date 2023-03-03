import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SchedulesController } from './schedules.controller';
import { SchedulesService } from './schedules.service';
import { Schedule } from './entities/schedule.entity';
import { JwtTokenModule } from 'src/infra/jwttoken/jwttoken.module';

@Module({
  imports: [TypeOrmModule.forFeature([Schedule]), JwtTokenModule],
  controllers: [SchedulesController],
  providers: [SchedulesService],
})
export class SchedulesModule {}
