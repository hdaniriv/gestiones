import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmpleadoTipoEntity } from '../domain/entities/empleado-tipo.entity';
import { CreateEmpleadoTipoDto } from './dto/create-empleado-tipo.dto';
import { UpdateEmpleadoTipoDto } from './dto/update-empleado-tipo.dto';

@Injectable()
export class EmpleadoTipoService {
  constructor(
    @InjectRepository(EmpleadoTipoEntity)
    private readonly repo: Repository<EmpleadoTipoEntity>,
  ) {}

  create(dto: CreateEmpleadoTipoDto, userId?: number) {
    const entity = this.repo.create({ ...dto, idUsuarioCreador: userId ?? 0 });
    return this.repo.save(entity);
  }

  findAll() {
    return this.repo.find({ order: { id: 'ASC' } });
  }

  async findOne(id: number) {
    const found = await this.repo.findOne({ where: { id } });
    if (!found) throw new NotFoundException('EmpleadoTipo no encontrado');
    return found;
  }

  async update(id: number, dto: UpdateEmpleadoTipoDto) {
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
