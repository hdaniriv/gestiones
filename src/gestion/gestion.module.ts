import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GestionEntity } from '../domain/entities/gestion.entity';
import { GestionController } from './gestion.controller';
import { GestionService } from './gestion.service';

@Module({
  imports: [TypeOrmModule.forFeature([GestionEntity])],
  controllers: [GestionController],
  providers: [GestionService],
})
export class GestionModule {}
