import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CryptModule } from 'src/infra/crypt/crypt.module';
import { JwtTokenModule } from 'src/infra/jwttoken/jwttoken.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), CryptModule, JwtTokenModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
