import { Controller, Request, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from 'src/common/guards/local-auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: 'Realiza o login de um usuário' })
  @ApiResponse({ status: 200, description: 'Usuário autenticado com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
}
