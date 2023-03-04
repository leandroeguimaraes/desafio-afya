import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Put,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/common/custom-decorator/roles-decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { EnumRole } from '../users/enum/roles.enum';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { Schedule } from './entities/schedule.entity';
import { SchedulesService } from './schedules.service';

@ApiTags('schedules')
@Controller('schedules')
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(EnumRole.ADMIN, EnumRole.DOCTOR)
  @ApiOperation({ summary: 'Cria um novo agendamento' })
  @ApiResponse({
    status: 201,
    description: 'O agendamento foi criado com sucesso.',
    type: Schedule,
  })
  @ApiResponse({ status: 409, description: 'O agendamento já existe' })
  @ApiBearerAuth()
  async create(
    @Body() createScheduleDto: CreateScheduleDto,
  ): Promise<Schedule> {
    return this.schedulesService.create(createScheduleDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(EnumRole.ADMIN, EnumRole.DOCTOR)
  @ApiOperation({ summary: 'Obter todos os agendamentos' })
  @ApiResponse({
    status: 200,
    description: 'Uma lista de agendamentos foi retornada.',
    type: Schedule,
    isArray: true,
  })
  @ApiBearerAuth()
  async findAll(): Promise<Schedule[]> {
    return this.schedulesService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(EnumRole.ADMIN, EnumRole.DOCTOR)
  @ApiOperation({ summary: 'Obter um agendamento específico' })
  @ApiResponse({
    status: 200,
    description: 'O agendamento foi encontrado e retornado.',
    type: Schedule,
  })
  @ApiResponse({
    status: 404,
    description: 'O agendamento não foi encontrado.',
  })
  @ApiBearerAuth()
  async findOne(@Param('id') id: string): Promise<Schedule> {
    return this.schedulesService.findOne(+id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(EnumRole.ADMIN, EnumRole.DOCTOR)
  @ApiOperation({ summary: 'Atualiza um agendamento existente' })
  @ApiResponse({
    status: 200,
    description: 'O agendamento foi atualizado com sucesso.',
    type: Schedule,
  })
  @ApiResponse({
    status: 404,
    description: 'O agendamento não foi encontrado.',
  })
  @ApiBearerAuth()
  async update(
    @Param('id') id: string,
    @Body() updateScheduleDto: UpdateScheduleDto,
  ): Promise<Schedule> {
    return this.schedulesService.update(+id, updateScheduleDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(EnumRole.ADMIN, EnumRole.DOCTOR)
  @ApiOperation({ summary: 'Remove um agendamento existente' })
  @ApiResponse({
    status: 200,
    description: 'O agendamento foi removido com sucesso.',
  })
  @ApiResponse({
    status: 404,
    description: 'O agendamento não foi encontrado.',
  })
  @ApiBearerAuth()
  async remove(@Param('id') id: string): Promise<void> {
    return this.schedulesService.remove(+id);
  }
}
