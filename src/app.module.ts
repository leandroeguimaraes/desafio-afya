import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './app/users/users.module';
import { configuration } from './config/configuration';
import { validationSchema } from './config/validation';
import { dataSourceOptions } from '../db/data-source';
import { AuthModule } from './app/auth/auth.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { JwtStrategy } from './common/guards/jwt.strategy';
import { LocalStrategy } from './common/guards/local.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema,
      expandVariables: true,
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? '.env'
          : `${process.env.NODE_ENV}.env`,
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [JwtAuthGuard, LocalStrategy, JwtStrategy, AppService],
})
export class AppModule {}
