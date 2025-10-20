import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmpleadoEntity } from '../domain/entities/empleado.entity';
import { SupervisorTecnicoEntity } from '../domain/entities/supervisor-tecnico.entity';
import { EmpleadoTipoEntity } from '../domain/entities/empleado-tipo.entity';
import { EmpleadoController } from './empleado.controller';
import { EmpleadoService } from './empleado.service';

@Module({
  imports: [TypeOrmModule.forFeature([EmpleadoEntity, SupervisorTecnicoEntity, EmpleadoTipoEntity])],
  controllers: [EmpleadoController],
  providers: [EmpleadoService],
})
export class EmpleadoModule {}
