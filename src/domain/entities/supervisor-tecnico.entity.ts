import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity({ name: 'supervisorTecnico' })
export class SupervisorTecnicoEntity extends BaseEntity {
  @Column({ name: 'idSupervisor', type: 'int' })
  idSupervisor!: number;

  @Column({ name: 'idTecnico', type: 'int' })
  idTecnico!: number;
}
