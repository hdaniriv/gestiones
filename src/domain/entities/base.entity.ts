import { Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn({ name: 'fechaCreacion', type: 'timestamp with time zone' })
  fechaCreacion!: Date;

  @UpdateDateColumn({ name: 'fechaModificacion', type: 'timestamp with time zone' })
  fechaModificacion!: Date;

  @Column({ name: 'id_usuario_creador', type: 'int', nullable: false })
  idUsuarioCreador!: number;
}
