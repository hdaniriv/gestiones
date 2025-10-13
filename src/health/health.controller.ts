import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class HealthController {
  @MessagePattern({ cmd: 'health.ping' })
  ping(@Payload() message: { userContext?: any }) {
    const traceId = message?.userContext?.traceId || null;
    return {
      status: 'ok',
      service: 'gestion',
      time: new Date().toISOString(),
      traceId,
    };
  }
}
