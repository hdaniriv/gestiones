import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SupervisorTecnicoService } from './supervisor-tecnico.service';
import { CreateSupervisorTecnicoDto } from './dto/create-supervisor-tecnico.dto';
import { UpdateSupervisorTecnicoDto } from './dto/update-supervisor-tecnico.dto';

@Controller()
export class SupervisorTecnicoController {
  constructor(private readonly service: SupervisorTecnicoService) {}

  @MessagePattern({ cmd: 'supervisoresTecnicos.create.v1' })
  create(@Payload() message: { dto: CreateSupervisorTecnicoDto; userContext?: any }) {
    const { dto, userContext } = message;
    return this.service.create(dto, userContext?.userId);
  }

  @MessagePattern({ cmd: 'supervisoresTecnicos.findAll.v1' })
  findAll() { return this.service.findAll(); }

  @MessagePattern({ cmd: 'supervisoresTecnicos.findById.v1' })
  findById(@Payload() message: { id: number }) { return this.service.findOne(message.id); }

  @MessagePattern({ cmd: 'supervisoresTecnicos.update.v1' })
  update(@Payload() message: { id: number; dto: UpdateSupervisorTecnicoDto }) {
    const { id, dto } = message; return this.service.update(id, dto);
  }

  @MessagePattern({ cmd: 'supervisoresTecnicos.delete.v1' })
  remove(@Payload() message: { id: number }) { return this.service.remove(message.id); }
}
