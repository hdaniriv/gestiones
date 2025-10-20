import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClienteEntity } from '../domain/entities/cliente.entity';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';

@Injectable()
export class ClienteService {
  constructor(
    @InjectRepository(ClienteEntity)
    private readonly repo: Repository<ClienteEntity>,
  ) {}

  async create(dto: CreateClienteDto, userId?: number) {
    // Si viene idUsuario, validar que no exista ya un cliente asociado a ese usuario
    if (dto.idUsuario) {
      const existingByUser = await this.repo.findOne({ where: { idUsuario: dto.idUsuario } });
      if (existingByUser) {
        throw new Error('Ya existe un cliente asociado a este usuario');
      }
    }
    const entity = this.repo.create({
      nombre: dto.nombre,
      direccion: dto.direccion,
      telefono: dto.telefono,
      correo: dto.correo,
      nit: dto.nit,
      latitud: String(dto.latitud),
      longitud: String(dto.longitud),
      idUsuario: dto.idUsuario,
      idUsuarioCreador: userId ?? 0,
    });
    return this.repo.save(entity);
  }

  findAll() {
    return this.repo.find({ order: { id: 'ASC' } });
  }

  async findOne(id: number) {
    const found = await this.repo.findOne({ where: { id } });
    if (!found) throw new NotFoundException('Cliente no encontrado');
    return found;
  }

  async update(id: number, dto: UpdateClienteDto) {
    const existing = await this.findOne(id);
    const { latitud, longitud, ...rest } = dto as any;

    // Asignar campos regulares si vienen definidos
    Object.entries(rest).forEach(([key, value]) => {
      if (value !== undefined) {
        // @ts-ignore - asignación dinámica controlada
        (existing as any)[key] = value;
      }
    });

    // Castear latitud/longitud a string si vienen en el DTO
    if (latitud !== undefined) existing.latitud = String(latitud);
    if (longitud !== undefined) existing.longitud = String(longitud);

    return this.repo.save(existing);
  }

  async findByUsuario(idUsuario: number) {
    return this.repo.findOne({ where: { idUsuario } });
  }

  async remove(id: number) {
    const existing = await this.findOne(id);
    await this.repo.remove(existing);
    return { deleted: true };
  }
}
