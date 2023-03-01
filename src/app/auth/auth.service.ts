import { Inject, Injectable } from '@nestjs/common';
import {
  CRYPT_SERVICE,
  ICryptService,
} from 'src/infra/crypt/interface/crypt.interface';
import {
  IJwtTokenService,
  JWTTOKEN_SERVICE,
} from 'src/infra/jwttoken/interface/jwttoken.interface';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(JWTTOKEN_SERVICE) private jwtTokenService: IJwtTokenService,
    @Inject(CRYPT_SERVICE) private cryptService: ICryptService,
    private usersService: UsersService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
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
