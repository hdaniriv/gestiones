import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TipoGestionService } from './tipo-gestion.service';
import { CreateTipoGestionDto } from './dto/create-tipo-gestion.dto';
import { UpdateTipoGestionDto } from './dto/update-tipo-gestion.dto';

@Controller()
export class TipoGestionController {
  constructor(private readonly service: TipoGestionService) {}

  @MessagePattern({ cmd: 'tipoGestiones.create.v1' })
  create(@Payload() message: { dto: CreateTipoGestionDto; userContext?: any }) {
    const { dto, userContext } = message;
    return this.service.create(dto, userContext?.userId);
  }

  @MessagePattern({ cmd: 'tipoGestiones.findAll.v1' })
  findAll() {
    return this.service.findAll();
  }

  @MessagePattern({ cmd: 'tipoGestiones.findById.v1' })
  findById(@Payload() message: { id: number }) {
    return this.service.findOne(message.id);
  }

  @MessagePattern({ cmd: 'tipoGestiones.update.v1' })
  update(@Payload() message: { id: number; dto: UpdateTipoGestionDto }) {
    const { id, dto } = message;
    return this.service.update(id, dto);
  }

  @MessagePattern({ cmd: 'tipoGestiones.delete.v1' })
  remove(@Payload() message: { id: number }) {
    return this.service.remove(message.id);
  }
}
