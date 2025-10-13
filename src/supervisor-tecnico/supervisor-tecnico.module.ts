import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupervisorTecnicoEntity } from '../domain/entities/supervisor-tecnico.entity';
import { SupervisorTecnicoController } from './supervisor-tecnico.controller';
import { SupervisorTecnicoService } from './supervisor-tecnico.service';

@Module({
  imports: [TypeOrmModule.forFeature([SupervisorTecnicoEntity])],
  controllers: [SupervisorTecnicoController],
  providers: [SupervisorTecnicoService],
})
export class SupervisorTecnicoModule {}
