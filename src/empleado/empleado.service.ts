import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmpleadoEntity } from '../domain/entities/empleado.entity';
import { CreateEmpleadoDto } from './dto/create-empleado.dto';
import { UpdateEmpleadoDto } from './dto/update-empleado.dto';

@Injectable()
export class EmpleadoService {
  constructor(
    @InjectRepository(EmpleadoEntity)
    private readonly repo: Repository<EmpleadoEntity>,
  ) {}

  create(dto: CreateEmpleadoDto, userId?: number) {
    const entity = this.repo.create({ ...dto, idUsuarioCreador: userId ?? 0 });
    return this.repo.save(entity);
  }

  findAll() {
    return this.repo.find({ order: { id: 'ASC' } });
  }

  async findOne(id: number) {
    const found = await this.repo.findOne({ where: { id } });
    if (!found) throw new NotFoundException('Empleado no encontrado');
    return found;
  }

  async update(id: number, dto: UpdateEmpleadoDto) {
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
