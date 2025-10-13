import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { GestionService } from './gestion.service';
import { CreateGestionDto } from './dto/create-gestion.dto';
import { UpdateGestionDto } from './dto/update-gestion.dto';

@Controller()
export class GestionController {
  constructor(private readonly service: GestionService) {}

  @MessagePattern({ cmd: 'gestiones.create.v1' })
  create(@Payload() message: { dto: CreateGestionDto; userContext?: any }) {
    const { dto, userContext } = message;
    return this.service.create(dto, userContext?.userId);
  }

  @MessagePattern({ cmd: 'gestiones.findAll.v1' })
  findAll() {
    return this.service.findAll();
  }

  @MessagePattern({ cmd: 'gestiones.findById.v1' })
  findById(@Payload() message: { id: number }) {
    return this.service.findOne(message.id);
  }

  @MessagePattern({ cmd: 'gestiones.update.v1' })
  update(@Payload() message: { id: number; dto: UpdateGestionDto }) {
    const { id, dto } = message;
    return this.service.update(id, dto);
  }

  @MessagePattern({ cmd: 'gestiones.delete.v1' })
  remove(@Payload() message: { id: number }) {
    return this.service.remove(message.id);
  }
}
