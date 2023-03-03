import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientsController } from './patients.controller';
import { PatientsService } from './patients.service';
import { Patient } from './entities/patient.entity';
import { JwtTokenModule } from 'src/infra/jwttoken/jwttoken.module';

@Module({
  imports: [TypeOrmModule.forFeature([Patient]), JwtTokenModule],
  controllers: [PatientsController],
  providers: [PatientsService],
})
export class PatientsModule {}
