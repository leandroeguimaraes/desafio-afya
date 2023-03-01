import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { EnumRole } from 'src/app/users/enum/roles.enum';
import {
  IJwtTokenService,
  JWTTOKEN_SERVICE,
} from 'src/infra/jwttoken/interface/jwttoken.interface';
import { ROLES_KEY } from '../custom-decorator/roles-decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(JWTTOKEN_SERVICE) private jwtTokenService: IJwtTokenService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<EnumRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authorizationHeader = request.headers.authorization;

    if (!authorizationHeader) {
      throw new UnauthorizedException('Não autorizado');
    }

    const token = authorizationHeader.split(' ')[1];
    const { role } = this.jwtTokenService.decode(token);

    return requiredRoles.includes(role);
  }
}
