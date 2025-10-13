import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity({ name: 'empleado' })
export class EmpleadoEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  nombres!: string;

  @Column({ type: 'varchar', length: 100 })
  apellidos!: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  telefono?: string | null;

  @Column({ type: 'varchar', length: 200, nullable: true })
  direccion?: string | null;

  @Column({ name: 'idEmpleadoTipo', type: 'int' })
  idEmpleadoTipo!: number;

  @Column({ name: 'idUsuario', type: 'int', nullable: true })
  idUsuario?: number | null;
}
