import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JWTTOKEN_SERVICE } from './interface/jwttoken.interface';
import { JwttokenService } from './jwttoken.service';

const JWTTokenService = {
  provide: JWTTOKEN_SERVICE,
  useClass: JwttokenService
};

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: config.get<string | number>('JWT_EXPIRES'),
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [JWTTokenService],
  exports: [JWTTokenService]
})
export class JwtTokenModule { }
