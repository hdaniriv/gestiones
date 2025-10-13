import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { EmpleadoTipoService } from './empleado-tipo.service';
import { CreateEmpleadoTipoDto } from './dto/create-empleado-tipo.dto';
import { UpdateEmpleadoTipoDto } from './dto/update-empleado-tipo.dto';

@Controller()
export class EmpleadoTipoController {
  constructor(private readonly service: EmpleadoTipoService) {}

  @MessagePattern({ cmd: 'empleadoTipos.create.v1' })
  create(@Payload() message: { dto: CreateEmpleadoTipoDto; userContext?: any }) {
    const { dto, userContext } = message;
    return this.service.create(dto, userContext?.userId);
  }

  @MessagePattern({ cmd: 'empleadoTipos.findAll.v1' })
  findAll() {
    return this.service.findAll();
  }

  @MessagePattern({ cmd: 'empleadoTipos.findById.v1' })
  findById(@Payload() message: { id: number }) {
    return this.service.findOne(message.id);
  }

  @MessagePattern({ cmd: 'empleadoTipos.update.v1' })
  update(@Payload() message: { id: number; dto: UpdateEmpleadoTipoDto }) {
    const { id, dto } = message;
    return this.service.update(id, dto);
  }

  @MessagePattern({ cmd: 'empleadoTipos.delete.v1' })
  remove(@Payload() message: { id: number }) {
    return this.service.remove(message.id);
  }
}
