import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoGestionEntity } from '../domain/entities/tipo-gestion.entity';
import { TipoGestionController } from './tipo-gestion.controller';
import { TipoGestionService } from './tipo-gestion.service';

@Module({
  imports: [TypeOrmModule.forFeature([TipoGestionEntity])],
  controllers: [TipoGestionController],
  providers: [TipoGestionService],
})
export class TipoGestionModule {}
