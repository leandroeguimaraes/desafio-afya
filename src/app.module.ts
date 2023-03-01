import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './app/users/users.module';
import { configuration } from './config/configuration';
import { validationSchema } from './config/validation';
import { dataSourceOptions } from '../db/data-source';

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
    UsersModule,
    TypeOrmModule.forRoot(dataSourceOptions),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
