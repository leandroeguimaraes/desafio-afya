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
import { ConsultationsService } from './consultations.service';
import { CreateConsultationDto } from './dto/create-consultation.dto';
import { UpdateConsultationDto } from './dto/update-consultation.dto';
import { Consultation } from './entities/consultation.entity';

@ApiTags('consultations')
@Controller('consultations')
export class ConsultationsController {
  constructor(private readonly consultationsService: ConsultationsService) { }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(EnumRole.ADMIN)
  @ApiOperation({ summary: 'Cria uma nova consulta' })
  @ApiResponse({
    status: 201,
    description: 'A consulta foi criada com sucesso.',
    type: Consultation,
  })
  @ApiResponse({ status: 409, description: 'O agendamento já existe' })
  @ApiBearerAuth()
  async create(
    @Body() createConsultationDto: CreateConsultationDto,
  ): Promise<Consultation> {
    return this.consultationsService.create(createConsultationDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(EnumRole.ADMIN, EnumRole.DOCTOR)
  @ApiOperation({ summary: 'Obter todas as consultas' })
  @ApiResponse({
    status: 200,
    description: 'Uma lista de consultas foi retornada.',
    type: Consultation,
    isArray: true,
  })
  @ApiBearerAuth()
  async findAll(): Promise<Consultation[] | any> {
    return this.consultationsService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(EnumRole.ADMIN, EnumRole.DOCTOR)
  @ApiOperation({ summary: 'Obter uma consulta específica' })
  @ApiResponse({
    status: 200,
    description: 'A consulta foi encontrada e retornada.',
    type: Consultation,
  })
  @ApiResponse({
    status: 404,
    description: 'A consulta não foi encontrada.',
  })
  @ApiBearerAuth()
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Consultation> {
    return this.consultationsService.findOne(+id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(EnumRole.ADMIN, EnumRole.DOCTOR)
  @ApiOperation({ summary: 'Atualiza uma consulta existente' })
  @ApiResponse({
    status: 200,
    description: 'A consulta foi atualizada com sucesso.',
    type: Consultation,
  })
  @ApiResponse({
    status: 404,
    description: 'A consulta não foi encontrada.',
  })
  @ApiBearerAuth()
  async update(
    @Param('id') id: string,
    @Body() updateConsultationDto: UpdateConsultationDto,
  ): Promise<Consultation> {
    return this.consultationsService.update(+id, updateConsultationDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(EnumRole.ADMIN)
  @ApiOperation({ summary: 'Remove uma consulta existente' })
  @ApiResponse({
    status: 200,
    description: 'A consulta foi removido com sucesso.',
  })
  @ApiResponse({
    status: 404,
    description: 'A consulta não foi encontrado.',
  })
  @ApiBearerAuth()
  async remove(@Param('id') id: string): Promise<void> {
    return this.consultationsService.remove(+id);
  }
}
