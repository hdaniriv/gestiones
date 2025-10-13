import { PartialType } from '@nestjs/swagger';
import { CreateEmpleadoTipoDto } from './create-empleado-tipo.dto';

export class UpdateEmpleadoTipoDto extends PartialType(CreateEmpleadoTipoDto) {}
