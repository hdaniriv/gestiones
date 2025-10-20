import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { EmpleadoService } from './empleado.service';
import { CreateEmpleadoDto } from './dto/create-empleado.dto';
import { UpdateEmpleadoDto } from './dto/update-empleado.dto';

@Controller()
export class EmpleadoController {
  constructor(private readonly service: EmpleadoService) {}

  @MessagePattern({ cmd: 'empleados.create.v1' })
  create(@Payload() message: { dto: CreateEmpleadoDto; userContext?: any }) {
    const { dto, userContext } = message;
    return this.service.create(dto, userContext?.userId);
  }

  @MessagePattern({ cmd: 'empleados.findAll.v1' })
  findAll() {
    return this.service.findAll();
  }

  @MessagePattern({ cmd: 'empleados.findById.v1' })
  findById(@Payload() message: { id: number }) {
    return this.service.findOne(message.id);
  }

  @MessagePattern({ cmd: 'empleados.findBySupervisor.v1' })
  findBySupervisor(@Payload() message: { idSupervisor: number }) {
    return this.service.findTecnicosBySupervisor(message.idSupervisor);
  }

  @MessagePattern({ cmd: 'empleados.update.v1' })
  update(@Payload() message: { id: number; dto: UpdateEmpleadoDto }) {
    const { id, dto } = message;
    return this.service.update(id, dto);
  }

  @MessagePattern({ cmd: 'empleados.delete.v1' })
  remove(@Payload() message: { id: number }) {
    return this.service.remove(message.id);
  }
}
