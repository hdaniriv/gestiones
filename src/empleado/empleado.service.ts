import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { EmpleadoEntity } from '../domain/entities/empleado.entity';
import { CreateEmpleadoDto } from './dto/create-empleado.dto';
import { UpdateEmpleadoDto } from './dto/update-empleado.dto';
import { SupervisorTecnicoEntity } from '../domain/entities/supervisor-tecnico.entity';
import { InjectRepository as InjectRepo } from '@nestjs/typeorm';
import { EmpleadoTipoEntity } from '../domain/entities/empleado-tipo.entity';

@Injectable()
export class EmpleadoService {
  constructor(
    @InjectRepository(EmpleadoEntity)
    private readonly repo: Repository<EmpleadoEntity>,
    @InjectRepository(SupervisorTecnicoEntity)
    private readonly supTecRepo: Repository<SupervisorTecnicoEntity>,
    @InjectRepository(EmpleadoTipoEntity)
    private readonly tipoRepo: Repository<EmpleadoTipoEntity>,
  ) {}

  create(dto: CreateEmpleadoDto, userId?: number) {
    const entity = this.repo.create({ ...dto, idUsuarioCreador: userId ?? 0 });
    return this.repo.save(entity);
  }

  findAll() {
    return this.repo.find({ order: { id: 'ASC' } });
  }

  async findByUsuario(idUsuario: number) {
    if (!idUsuario && idUsuario !== 0) return null;
    const found = await this.repo.findOne({ where: { idUsuario } });
    return found || null;
  }

  async findOne(id: number) {
    const found = await this.repo.findOne({ where: { id } });
    if (!found) throw new NotFoundException('Empleado no encontrado');
    return found;
  }

  async update(id: number, dto: UpdateEmpleadoDto) {
    const prev = await this.findOne(id);
    const prevTipo = prev.idEmpleadoTipo;
    Object.assign(prev, dto);
    const saved = await this.repo.save(prev);
    // Auto-reset: si dejó de ser supervisor, eliminar sus asignaciones
    const tipoNombre = (await this.tipoRepo.findOne({ where: { id: saved.idEmpleadoTipo } }))?.nombre?.toLowerCase() || '';
    const eraSupervisor = (await this.tipoRepo.findOne({ where: { id: prevTipo } }))?.nombre?.toLowerCase().includes('supervisor');
    const esSupervisor = tipoNombre.includes('supervisor');
    if (eraSupervisor && !esSupervisor) {
      const rows = await this.supTecRepo.find({ where: { idSupervisor: id } });
      if (rows.length) await this.supTecRepo.remove(rows);
    }
    return saved;
  }

  // Tecnicos asignados a un supervisor
  async findTecnicosBySupervisor(idSupervisor: number) {
    const rels = await this.supTecRepo.find({ where: { idSupervisor } });
    if (rels.length === 0) return [] as EmpleadoEntity[];
    const ids = rels.map((r) => r.idTecnico);
    return this.repo.find({ where: { id: In(ids) }, order: { id: 'ASC' } });
  }

  async remove(id: number) {
    const prev = await this.findOne(id);
    await this.repo.remove(prev);
    return { deleted: true };
  }
}
