import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GestionEntity } from '../domain/entities/gestion.entity';
import { CreateGestionDto } from './dto/create-gestion.dto';
import { UpdateGestionDto } from './dto/update-gestion.dto';

@Injectable()
export class GestionService {
  constructor(
    @InjectRepository(GestionEntity)
    private readonly repo: Repository<GestionEntity>,
  ) {}

  create(dto: CreateGestionDto, userId?: number) {
    const entity = this.repo.create({
      idCliente: dto.idCliente,
      idTecnico: dto.idTecnico,
      idTipoGestion: dto.idTipoGestion,
      direccion: dto.direccion,
      latitud: dto.latitud?.toString() ?? null,
      longitud: dto.longitud?.toString() ?? null,
      fechaProgramada: new Date(dto.fechaProgramada),
      fechaInicio: dto.fechaInicio ? new Date(dto.fechaInicio) : null,
      fechaFin: dto.fechaFin ? new Date(dto.fechaFin) : null,
      observaciones: dto.observaciones,
      estado: dto.estado ?? 'Pendiente',
      idUsuarioCreador: userId ?? 0,
    });
    return this.repo.save(entity);
  }

  findAll() {
    return this.repo.find({ order: { id: 'DESC' } });
  }

  async findOne(id: number) {
    const found = await this.repo.findOne({ where: { id } });
    if (!found) throw new NotFoundException('Gestion no encontrada');
    return found;
  }

  async update(id: number, dto: UpdateGestionDto) {
    const prev = await this.findOne(id);
    Object.assign(prev, {
      ...dto,
      latitud: dto.latitud !== undefined ? dto.latitud?.toString() : prev.latitud,
      longitud: dto.longitud !== undefined ? dto.longitud?.toString() : prev.longitud,
      fechaProgramada: dto.fechaProgramada ? new Date(dto.fechaProgramada) : prev.fechaProgramada,
      fechaInicio: dto.fechaInicio ? new Date(dto.fechaInicio) : prev.fechaInicio,
      fechaFin: dto.fechaFin ? new Date(dto.fechaFin) : prev.fechaFin,
    });
    return this.repo.save(prev);
  }

  async remove(id: number) {
    const prev = await this.findOne(id);
    await this.repo.remove(prev);
    return { deleted: true };
  }
}
