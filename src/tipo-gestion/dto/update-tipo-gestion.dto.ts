import { PartialType } from '@nestjs/swagger';
import { CreateTipoGestionDto } from './create-tipo-gestion.dto';

export class UpdateTipoGestionDto extends PartialType(CreateTipoGestionDto) {}
