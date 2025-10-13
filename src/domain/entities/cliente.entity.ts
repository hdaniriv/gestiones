import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity({ name: 'cliente' })
export class ClienteEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 150 })
  nombre!: string;

  @Column({ type: 'varchar', length: 200 })
  direccion!: string;

  @Column({ type: 'varchar', length: 50 })
  telefono!: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  correo?: string | null;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 50 })
  nit!: string;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  latitud!: string;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  longitud!: string;

  @Column({ name: 'id_usuario', type: 'int', nullable: true })
  idUsuario?: number | null;
}
