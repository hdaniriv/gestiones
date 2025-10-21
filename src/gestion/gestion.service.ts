import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, IsNull, Not, Repository } from 'typeorm';
import { GestionEntity } from '../domain/entities/gestion.entity';
import { EmpleadoEntity } from '../domain/entities/empleado.entity';
import { ClienteEntity } from '../domain/entities/cliente.entity';
import { SupervisorTecnicoEntity } from '../domain/entities/supervisor-tecnico.entity';
import { CreateGestionDto } from './dto/create-gestion.dto';
import { UpdateGestionDto } from './dto/update-gestion.dto';
import { QueryGestionesDto } from './dto/query-gestiones.dto';

@Injectable()
export class GestionService {
  constructor(
    @InjectRepository(GestionEntity)
    private readonly repo: Repository<GestionEntity>,
    @InjectRepository(EmpleadoEntity)
    private readonly empleadoRepo: Repository<EmpleadoEntity>,
    @InjectRepository(ClienteEntity)
    private readonly clienteRepo: Repository<ClienteEntity>,
  ) {}

  create(dto: CreateGestionDto, userId?: number) {
    const ensureDate = (s?: string): Date => {
      const d = s ? new Date(s) : new Date();
      return isNaN(d.getTime()) ? new Date() : d;
    };
    // Validar consistencia mínima: fechaProgramada requerida por DTO; si trae inicio/fin, deben respetar el orden
    const dProg = ensureDate(dto.fechaProgramada);
    const dIni = dto.fechaInicio ? new Date(dto.fechaInicio) : undefined;
    const dFin = dto.fechaFin ? new Date(dto.fechaFin) : undefined;
    if (dIni && dIni < dProg) {
      throw new Error('Fecha de inicio no puede ser anterior a la programada');
    }
    if (dFin && (!dIni || dFin < dIni)) {
      throw new Error('Fecha de fin no puede ser anterior a la de inicio');
    }
    // Estado inicial por reglas
    let estado = 'Nuevo';
    if (dto.idTecnico) estado = 'Asignado';
    if (dIni) estado = 'En Proceso';
    if (dFin) estado = 'Finalizado';
    const entity = this.repo.create({
      idCliente: dto.idCliente,
      idTecnico: dto.idTecnico,
      idTipoGestion: dto.idTipoGestion,
      direccion: dto.direccion,
      latitud: dto.latitud !== undefined ? dto.latitud?.toString() : undefined,
      longitud: dto.longitud !== undefined ? dto.longitud?.toString() : undefined,
      fechaProgramada: dProg,
      fechaInicio: dIni,
      fechaFin: dFin,
      observaciones: dto.observaciones,
      estado,
      idUsuarioCreador: userId ?? 0,
    } as any);
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

  async update(
    id: number,
    dto: UpdateGestionDto,
    userContext?: { userId?: number; roles?: string[] }
  ) {
    const prev = await this.findOne(id);
    const roles = (userContext?.roles || []).map((r) => r.toLowerCase());
    const isAdmin = roles.includes('administrador');
    const isSupervisor = roles.includes('supervisor');
    const isTecnico = roles.includes('técnico') || roles.includes('tecnico');

    // Validaciones de permisos para técnico
    if (isTecnico) {
      // Técnico sólo puede setear idTecnico/fechaInicio/fechaFin si están vacíos
      if (dto.idTecnico !== undefined && prev.idTecnico) {
        delete (dto as any).idTecnico;
      }
      if (dto.fechaInicio !== undefined && prev.fechaInicio) {
        delete (dto as any).fechaInicio;
      }
      if (dto.fechaFin !== undefined && prev.fechaFin) {
        delete (dto as any).fechaFin;
      }
      // Y nunca puede cambiar idCliente, idTipoGestion, direccion
      delete (dto as any).idCliente;
      delete (dto as any).idTipoGestion;
      delete (dto as any).direccion;
    }

    // Restricción adicional: Supervisor sólo puede asignar técnicos a su cargo
    if (isSupervisor && dto.idTecnico !== undefined) {
      const supEmpleado = userContext?.userId
        ? await this.empleadoRepo.findOne({ where: { idUsuario: userContext.userId } })
        : undefined;
      const idSupervisor = supEmpleado?.id;
      if (idSupervisor && dto.idTecnico) {
        const stRepo = this.repo.manager.getRepository(SupervisorTecnicoEntity);
        const count = await stRepo.count({ where: { idSupervisor, idTecnico: dto.idTecnico } as any });
        if (count === 0) {
          throw new Error('No puedes asignar un técnico que no está a tu cargo');
        }
      }
    }

    // Parsear fechas si vienen
    const dProg = dto.fechaProgramada ? new Date(dto.fechaProgramada) : prev.fechaProgramada;
    const dIni = dto.fechaInicio ? new Date(dto.fechaInicio) : prev.fechaInicio ?? undefined;
    const dFin = dto.fechaFin ? new Date(dto.fechaFin) : prev.fechaFin ?? undefined;

    // Reglas de consistencia: fechaprog <= fechaini <= fechafin
    if (dto.fechaInicio && !(dProg && dIni && dProg <= dIni)) {
      throw new Error('Fecha de inicio debe ser mayor o igual a la programada');
    }
    if (dto.fechaFin && !(dIni && dFin && dIni <= dFin)) {
      throw new Error('Fecha de fin debe ser mayor o igual a la de inicio');
    }

    // Reglas de estado automáticas
    let estado = prev.estado || 'Pendiente';
    const hasTec = (dto.idTecnico !== undefined ? dto.idTecnico : prev.idTecnico) ? true : false;
    const hasIni = !!dIni;
    const hasFin = !!dFin;
    if (hasFin) estado = 'Finalizado';
    else if (hasIni) estado = 'En Proceso';
    else if (hasTec) estado = 'Asignado';
    else estado = 'Nuevo';

    Object.assign(prev, {
      ...dto,
      latitud: dto.latitud !== undefined ? dto.latitud?.toString() : prev.latitud,
      longitud: dto.longitud !== undefined ? dto.longitud?.toString() : prev.longitud,
      fechaProgramada: dProg,
      fechaInicio: dIni ?? null,
      fechaFin: dFin ?? null,
      estado,
    });
    return this.repo.save(prev);
  }

  async remove(id: number) {
    const prev = await this.findOne(id);
    await this.repo.remove(prev);
    return { deleted: true };
  }

  // Búsqueda con filtros y reglas de visibilidad
  async search(
    query: QueryGestionesDto,
    userContext?: { userId?: number; roles?: string[] }
  ) {
  const qb = this.repo.createQueryBuilder('g');
    const parseDate = (s?: string): Date | undefined => {
      if (!s) return undefined;
      const t = s.toString().trim();
      if (!t || t.toLowerCase() === 'null' || t.toLowerCase() === 'undefined') return undefined;
      // YYYY-MM-DD (fecha corta, sin hora) -> construir fecha LOCAL para evitar desfaces de zona
      const ymd = /^(\d{4})-(\d{2})-(\d{2})$/;
      const mIso = t.match(ymd);
      if (mIso) {
        const y = Number(mIso[1]);
        const m = Number(mIso[2]);
        const d = Number(mIso[3]);
        return new Date(y, m - 1, d); // local midnight
      }
      // ISO extendido con hora/offset
      const isoLike = /^(\d{4}-\d{2}-\d{2})[ tT]\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})?$/;
      if (!isoLike.test(t)) return undefined;
      const d = new Date(t);
      return isNaN(d.getTime()) ? undefined : d;
    };

    // Filtro por estado de finalización
    if (query.estadoFinalizacion === 'finalizadas') {
      qb.andWhere('g.fechaFin IS NOT NULL');
    } else if (query.estadoFinalizacion === 'no-finalizadas') {
      qb.andWhere('g.fechaFin IS NULL');
    }

    // Filtro por asignación a técnico
    if (query.asignacion === 'sin-tecnico') {
      qb.andWhere('g.idTecnico IS NULL');
    } else if (query.asignacion === 'con-tecnico') {
      qb.andWhere('g.idTecnico IS NOT NULL');
    }

    // Filtro por fechas: utilizaremos fechaProgramada como referencia principal
    const dFrom = parseDate(query.desde);
    const dTo = parseDate(query.hasta);
    if (dFrom) {
      dFrom.setHours(0, 0, 0, 0);
      qb.andWhere('g.fechaProgramada >= :desde', { desde: dFrom });
    }
    if (dTo) {
      dTo.setHours(23, 59, 59, 999);
      qb.andWhere('g.fechaProgramada <= :hasta', { hasta: dTo });
    }

    // Filtro por tipo de gestión
    if (query.idTipoGestion) {
      qb.andWhere('g.idTipoGestion = :idTipoGestion', { idTipoGestion: query.idTipoGestion });
    }

    // Filtro por estado textual o derivado (robusto a variaciones)
    if (query.estado) {
      const normalizeText = (s?: string) =>
        (s ?? '')
          .normalize('NFD') // quitar acentos
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[_-]+/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()
          .toLowerCase();
      const rawEstado = normalizeText(query.estado);
      // Mapear a claves canónicas tolerando repeticiones
      const contains = (needle: string) => rawEstado.includes(needle);
  let estadoKey: 'nuevo' | 'asignado' | 'en proceso' | 'finalizado' | null = null;
      if (contains('en proceso')) estadoKey = 'en proceso';
      else if (contains('finaliz')) estadoKey = 'finalizado';
  else if (contains('asignad')) estadoKey = 'asignado';
      else if (contains('nuevo') || contains('pendiente')) estadoKey = 'nuevo';

      if (estadoKey === 'nuevo') {
        qb.andWhere('g.idTecnico IS NULL AND g.fechaFin IS NULL');
      } else if (estadoKey === 'asignado') {
        qb.andWhere('g.idTecnico IS NOT NULL AND g.fechaInicio IS NULL AND g.fechaFin IS NULL');
      } else if (estadoKey === 'en proceso') {
        qb.andWhere('g.idTecnico IS NOT NULL AND g.fechaFin IS NULL');
      } else if (estadoKey === 'finalizado') {
        qb.andWhere('g.fechaFin IS NOT NULL');
      } else {
        // Igualdad textual normalizada para estados personalizados/desconocidos
        qb.andWhere('LOWER(TRIM(g.estado)) = :estado', { estado: rawEstado });
      }
    }

    // Reglas de visibilidad según rol
    const roles = (userContext?.roles || []).map((r) => r.toLowerCase());
    const isAdmin = roles.includes('administrador'.toLowerCase());
    const isSupervisor = roles.includes('supervisor'.toLowerCase());
    const isTecnico = roles.includes('técnico') || roles.includes('tecnico');
    const isCliente = roles.includes('cliente');

    if (isAdmin) {
      // Admin ve todo
    } else if (isSupervisor) {
      // Supervisor: sin técnico asignado y las asignadas a sus técnicos
      if (userContext?.userId) {
        const supEmpleado = await this.empleadoRepo.findOne({ where: { idUsuario: userContext.userId } });
        const idSupervisor = supEmpleado?.id ?? -1;
        // Subquery con QueryBuilder para evitar dependencias de nombre de tabla
        const sub = this.repo
          .createQueryBuilder()
          .subQuery()
          .select('st.idTecnico')
          .from(SupervisorTecnicoEntity, 'st')
          .where('st.idSupervisor = :idSupervisor')
          .getQuery();
        qb.andWhere(`(g.idTecnico IS NULL OR g.idTecnico IN ${sub})`, { idSupervisor });
      } else {
        qb.andWhere('g.idTecnico IS NULL');
      }
    } else if (isTecnico) {
      // Técnico: solo sus propias gestiones
      let idTecnico = query.idTecnico;
      if (!idTecnico && userContext?.userId) {
        const emp = await this.empleadoRepo.findOne({ where: { idUsuario: userContext.userId } });
        idTecnico = emp?.id;
      }
      if (idTecnico) {
        qb.andWhere('g.idTecnico = :idTecnico', { idTecnico });
      } else {
        // Sin idTecnico no podemos determinar; devolver vacío por seguridad
        qb.andWhere('1=0');
      }
    } else if (isCliente) {
      // Cliente: solo sus gestiones
      let idCliente = query.idCliente;
      if (!idCliente && userContext?.userId) {
        const cli = await this.clienteRepo.findOne({ where: { idUsuario: userContext.userId } });
        idCliente = cli?.id;
      }
      if (idCliente) {
        qb.andWhere('g.idCliente = :idCliente', { idCliente });
      } else {
        qb.andWhere('1=0');
      }
    } else {
      // Otros roles no definidos: no ven nada
      qb.andWhere('1=0');
    }

    qb.orderBy('g.id', 'DESC');
    return qb.getMany();
  }

  async sinTecnico(query?: { desde?: string; hasta?: string }) {
    const qb = this.repo.createQueryBuilder('g').where('g.idTecnico IS NULL');
    const parseDate2 = (s?: string): Date | undefined => {
      if (!s) return undefined;
      const t = s.toString().trim();
      const ymd = /^(\d{4})-(\d{2})-(\d{2})$/;
      const m = t.match(ymd);
      if (m) return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
      const iso = /^(\d{4}-\d{2}-\d{2})[ tT]\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})?$/;
      if (!iso.test(t)) return undefined;
      const d = new Date(t);
      return isNaN(d.getTime()) ? undefined : d;
    };
    const dFrom = parseDate2(query?.desde);
    const dTo = parseDate2(query?.hasta);
    if (dFrom) {
      dFrom.setHours(0, 0, 0, 0);
      qb.andWhere('g.fechaProgramada >= :desde', { desde: dFrom });
    }
    if (dTo) {
      dTo.setHours(23, 59, 59, 999);
      qb.andWhere('g.fechaProgramada <= :hasta', { hasta: dTo });
    }
    qb.orderBy('g.id', 'DESC');
    return qb.getMany();
  }
}
