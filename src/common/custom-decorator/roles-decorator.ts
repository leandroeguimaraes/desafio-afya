import { SetMetadata } from '@nestjs/common';
import { EnumRole } from 'src/app/users/enum/roles.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: EnumRole[]) => SetMetadata(ROLES_KEY, roles);
