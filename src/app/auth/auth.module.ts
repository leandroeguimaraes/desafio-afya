import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { CryptModule } from 'src/infra/crypt/crypt.module';
import { JwtTokenModule } from 'src/infra/jwttoken/jwttoken.module';

@Module({
  imports: [PassportModule, JwtTokenModule, CryptModule, UsersModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
