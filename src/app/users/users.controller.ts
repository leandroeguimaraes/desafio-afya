import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from 'src/common/custom-decorator/roles-decorator';
import { EnumRole } from './enum/roles.enum';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('users')
@ApiExtraModels(CreateUserDto, UpdateUserDto)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RolesGuard)
  @Roles(EnumRole.ADMIN)
  @ApiOperation({ summary: 'Cria um novo usuário' })
  @ApiResponse({
    status: 201,
    description: 'O usuário foi criado com sucesso.',
  })
  @ApiResponse({ status: 409, description: 'Usuário já existe' })
  @ApiBearerAuth()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RolesGuard)
  @Roles(EnumRole.ADMIN)
  @ApiOperation({ summary: 'Obter todos os usuários' })
  @ApiResponse({
    status: 200,
    description: 'Uma lista de usuários foi retornada.',
  })
  @ApiBearerAuth()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @UseGuards(RolesGuard)
  @Roles(EnumRole.ADMIN)
  @ApiOperation({ summary: 'Obter um usuário específico' })
  @ApiResponse({
    status: 200,
    description: 'O usuário foi encontrado e retornado.',
  })
  @ApiResponse({ status: 404, description: 'O usuário não foi encontrado.' })
  @ApiBearerAuth()
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Get('email/:email')
  @UseGuards(JwtAuthGuard)
  @UseGuards(RolesGuard)
  @Roles(EnumRole.ADMIN)
  @ApiOperation({ summary: 'Buscar usuário por email' })
  @ApiResponse({
    status: 200,
    description: 'O usuário foi encontrado e retornado.',
  })
  @ApiResponse({ status: 404, description: 'O usuário não foi encontrado.' })
  @ApiBearerAuth()
  async findByEmail(@Param('email') email: string) {
    const user = await this.usersService.findByEmail(email);
    return user;
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @UseGuards(RolesGuard)
  @Roles(EnumRole.ADMIN)
  @ApiOperation({ summary: 'Atualiza um usuário existente' })
  @ApiResponse({
    status: 200,
    description: 'O usuário foi atualizado com sucesso.',
  })
  @ApiResponse({ status: 404, description: 'O usuário não foi encontrado.' })
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @UseGuards(RolesGuard)
  @Roles(EnumRole.ADMIN)
  @ApiOperation({ summary: 'Remove um usuário existente' })
  @ApiResponse({
    status: 200,
    description: 'O usuário foi removido com sucesso.',
  })
  @ApiResponse({ status: 404, description: 'O usuário não foi encontrado.' })
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
