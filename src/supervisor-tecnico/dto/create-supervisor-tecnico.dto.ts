import { IsInt, Min } from 'class-validator';

export class CreateSupervisorTecnicoDto {
  @IsInt()
  @Min(1)
  idSupervisor!: number;

  @IsInt()
  @Min(1)
  idTecnico!: number;
}
