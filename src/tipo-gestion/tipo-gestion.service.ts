import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoGestionEntity } from '../domain/entities/tipo-gestion.entity';
import { CreateTipoGestionDto } from './dto/create-tipo-gestion.dto';
import { UpdateTipoGestionDto } from './dto/update-tipo-gestion.dto';

@Injectable()
export class TipoGestionService {
  constructor(
    @InjectRepository(TipoGestionEntity)
    private readonly repo: Repository<TipoGestionEntity>,
  ) {}

  create(dto: CreateTipoGestionDto, userId?: number) {
    const entity = this.repo.create({ ...dto, idUsuarioCreador: userId ?? 0 });
    return this.repo.save(entity);
  }

  findAll() {
    return this.repo.find({ order: { id: 'ASC' } });
  }

  async findOne(id: number) {
    const found = await this.repo.findOne({ where: { id } });
    if (!found) throw new NotFoundException('TipoGestion no encontrado');
    return found;
  }

  async update(id: number, dto: UpdateTipoGestionDto) {
    const prev = await this.findOne(id);
    Object.assign(prev, dto);
    return this.repo.save(prev);
  }

  async remove(id: number) {
    const prev = await this.findOne(id);
    await this.repo.remove(prev);
    return { deleted: true };
  }
}
