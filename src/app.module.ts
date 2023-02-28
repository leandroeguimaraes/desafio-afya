import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configuration } from './config/configuration';
import { validationSchema } from './config/validation';
import { TypeOrmDatabaseModule } from './infra/database/postgres/typeorm.database.module';

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
    TypeOrmDatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
