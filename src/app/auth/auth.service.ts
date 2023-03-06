import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CRYPT_SERVICE,
  ICryptService,
} from 'src/infra/crypt/interface/crypt.interface';
import {
  IJwtTokenService,
  JWTTOKEN_SERVICE,
} from 'src/infra/jwttoken/interface/jwttoken.interface';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @Inject(JWTTOKEN_SERVICE) private jwtTokenService: IJwtTokenService,
    @Inject(CRYPT_SERVICE) private cryptService: ICryptService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'role'],
    });
    if (user && this.cryptService.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtTokenService.sign(payload, process.env.JWT_EXPIRES),
      refresh_token: this.jwtTokenService.sign(
        payload,
        process.env.REFRESH_TOKEN_EXPIRES,
      ),
    };
  }
}
