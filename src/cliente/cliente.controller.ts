import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ClienteService } from './cliente.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';

@Controller()
export class ClienteController {
  constructor(private readonly service: ClienteService) {}

  @MessagePattern({ cmd: 'clientes.create.v1' })
  create(@Payload() message: { dto: CreateClienteDto; userContext?: any }) {
    const { dto, userContext } = message;
    return this.service.create(dto, userContext?.userId);
  }

  @MessagePattern({ cmd: 'clientes.findAll.v1' })
  findAll() {
    return this.service.findAll();
  }

  @MessagePattern({ cmd: 'clientes.findById.v1' })
  findById(@Payload() message: { id: number }) {
    return this.service.findOne(message.id);
  }

  @MessagePattern({ cmd: 'clientes.update.v1' })
  update(@Payload() message: { id: number; dto: UpdateClienteDto }) {
    const { id, dto } = message;
    return this.service.update(id, dto);
  }

  @MessagePattern({ cmd: 'clientes.delete.v1' })
  remove(@Payload() message: { id: number }) {
    return this.service.remove(message.id);
  }

  @MessagePattern({ cmd: 'health.ping' })
  health(@Payload() message: any) {
    const now = new Date().toISOString();
    const traceId = message?.userContext?.traceId || null;
    return { status: 'ok', service: 'gestion', time: now, traceId };
  }
}
