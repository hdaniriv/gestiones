import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GestionEntity } from '../domain/entities/gestion.entity';
import { EmpleadoEntity } from '../domain/entities/empleado.entity';
import { ClienteEntity } from '../domain/entities/cliente.entity';
import { GestionController } from './gestion.controller';
import { GestionService } from './gestion.service';

@Module({
  imports: [TypeOrmModule.forFeature([GestionEntity, EmpleadoEntity, ClienteEntity])],
  controllers: [GestionController],
  providers: [GestionService],
})
export class GestionModule {}
