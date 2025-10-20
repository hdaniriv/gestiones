import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SupervisorTecnicoEntity } from '../domain/entities/supervisor-tecnico.entity';
import { CreateSupervisorTecnicoDto } from './dto/create-supervisor-tecnico.dto';
import { UpdateSupervisorTecnicoDto } from './dto/update-supervisor-tecnico.dto';

@Injectable()
export class SupervisorTecnicoService {
  constructor(
    @InjectRepository(SupervisorTecnicoEntity)
    private readonly repo: Repository<SupervisorTecnicoEntity>,
  ) {}

  create(dto: CreateSupervisorTecnicoDto, userId?: number) {
    const entity = this.repo.create({ ...dto, idUsuarioCreador: userId ?? 0 });
    return this.repo.save(entity);
  }

  findAll() {
    return this.repo.find({ order: { id: 'ASC' } });
  }

  findBySupervisor(idSupervisor: number) {
    return this.repo.find({ where: { idSupervisor }, order: { id: 'ASC' } });
  }

  async findOne(id: number) {
    const found = await this.repo.findOne({ where: { id } });
    if (!found) throw new NotFoundException('SupervisorTecnico no encontrado');
    return found;
  }

  async update(id: number, dto: UpdateSupervisorTecnicoDto) {
    const prev = await this.findOne(id);
    Object.assign(prev, dto);
    return this.repo.save(prev);
  }

  async remove(id: number) {
    const prev = await this.findOne(id);
    await this.repo.remove(prev);
    return { deleted: true };
  }

  async removeBySupervisor(idSupervisor: number) {
    const rows = await this.repo.find({ where: { idSupervisor } });
    if (rows.length === 0) return { deleted: 0 };
    await this.repo.remove(rows);
    return { deleted: rows.length };
  }
}
