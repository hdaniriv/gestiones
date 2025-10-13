import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmpleadoTipoEntity } from '../domain/entities/empleado-tipo.entity';
import { EmpleadoTipoController } from './empleado-tipo.controller';
import { EmpleadoTipoService } from './empleado-tipo.service';

@Module({
  imports: [TypeOrmModule.forFeature([EmpleadoTipoEntity])],
  controllers: [EmpleadoTipoController],
  providers: [EmpleadoTipoService],
})
export class EmpleadoTipoModule {}
