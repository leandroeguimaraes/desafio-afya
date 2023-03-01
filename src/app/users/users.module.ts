import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CryptModule } from 'src/infra/crypt/crypt.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), CryptModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
