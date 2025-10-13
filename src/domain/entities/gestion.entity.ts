import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity({ name: 'gestion' })
export class GestionEntity extends BaseEntity {
  @Column({ name: 'idCliente', type: 'int' })
  idCliente!: number;

  @Column({ name: 'idTecnico', type: 'int', nullable: true })
  idTecnico?: number | null;

  @Column({ name: 'idTipoGestion', type: 'int' })
  idTipoGestion!: number;

  @Column({ type: 'varchar', length: 200 })
  direccion!: string;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  latitud?: string | null;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  longitud?: string | null;

  @Column({ type: 'timestamp', name: 'fechaProgramada' })
  fechaProgramada!: Date;

  @Column({ type: 'timestamp', name: 'fechaInicio', nullable: true })
  fechaInicio?: Date | null;

  @Column({ type: 'timestamp', name: 'fechaFin', nullable: true })
  fechaFin?: Date | null;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  observaciones?: string | null;

  @Column({ type: 'varchar', length: 50, default: 'Pendiente' })
  estado!: string;
}
