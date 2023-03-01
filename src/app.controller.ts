import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@Controller()
@ApiTags('app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Retorna uma mensagem de boas vindas' })
  @ApiResponse({
    status: 200,
    description: 'Mensagem de boas vindas retornada com sucesso',
  })
  getHello(): string {
    return this.appService.getHello();
  }
}
