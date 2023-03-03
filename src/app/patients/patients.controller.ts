import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/custom-decorator/roles-decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { EnumRole } from '../users/enum/roles.enum';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { Patient } from './entities/patient.entity';
import { PatientsService } from './patients.service';

@ApiTags('patients')
@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) { }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(EnumRole.ADMIN, EnumRole.DOCTOR)
  @ApiOperation({ summary: 'Cria um novo paciente' })
  @ApiResponse({
    status: 201,
    description: 'O paciente foi criado com sucesso.',
    type: Patient,
  })
  @ApiResponse({ status: 409, description: 'Paciente já existe' })
  @ApiBearerAuth()
  async create(@Body() createPatientDto: CreatePatientDto): Promise<Patient> {
    return this.patientsService.create(createPatientDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(EnumRole.ADMIN, EnumRole.DOCTOR)
  @ApiOperation({ summary: 'Obter todos os pacientes' })
  @ApiResponse({
    status: 200,
    description: 'Uma lista de pacientes foi retornada.',
    type: Patient,
    isArray: true,
  })
  @ApiBearerAuth()
  async findAll(): Promise<Patient[]> {
    return this.patientsService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(EnumRole.ADMIN, EnumRole.DOCTOR)
  @ApiOperation({ summary: 'Obter um paciente específico' })
  @ApiResponse({
    status: 200,
    description: 'O paciente foi encontrado e retornado.',
    type: Patient,
  })
  @ApiResponse({ status: 404, description: 'O paciente não foi encontrado.' })
  @ApiBearerAuth()
  async findOne(@Param('id') id: string): Promise<Patient> {
    return this.patientsService.findOne(+id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(EnumRole.ADMIN, EnumRole.DOCTOR)
  @ApiOperation({ summary: 'Atualiza um paciente existente' })
  @ApiResponse({
    status: 200,
    description: 'O paciente foi atualizado com sucesso.',
    type: Patient,
  })
  @ApiResponse({ status: 404, description: 'O paciente não foi encontrado.' })
  @ApiBearerAuth()
  async update(@Param('id') id: string, @Body() updatePatientDto: UpdatePatientDto): Promise<Patient> {
    return this.patientsService.update(+id, updatePatientDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(EnumRole.ADMIN, EnumRole.DOCTOR)
  @ApiOperation({ summary: 'Remove um paciente existente' })
  @ApiResponse({
    status: 200,
    description: 'O paciente foi removido com sucesso.',
  })
  @ApiResponse({ status: 404, description: 'O paciente não foi encontrado.' })
  @ApiBearerAuth()
  async remove(@Param('id') id: string): Promise<void> {
    return this.patientsService.remove(+id);
  }
}