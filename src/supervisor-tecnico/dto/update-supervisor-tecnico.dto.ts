import { PartialType } from '@nestjs/swagger';
import { CreateSupervisorTecnicoDto } from './create-supervisor-tecnico.dto';

export class UpdateSupervisorTecnicoDto extends PartialType(CreateSupervisorTecnicoDto) {}
