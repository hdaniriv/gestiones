import { IsDateString, IsIn, IsInt, IsOptional, Min } from 'class-validator';

export class QueryGestionesDto {
  // Filtro por asignación
  @IsOptional()
  @IsIn(['sin-tecnico', 'con-tecnico'])
  asignacion?: 'sin-tecnico' | 'con-tecnico';

  // Filtro por estado finalizado o no
  @IsOptional()
  @IsIn(['finalizadas', 'no-finalizadas'])
  estadoFinalizacion?: 'finalizadas' | 'no-finalizadas';

  // Filtro por fechas (se usa cualquiera de los tres campos fechaProgramada/Inicio/Fin)
  @IsOptional()
  @IsDateString()
  desde?: string;

  @IsOptional()
  @IsDateString()
  hasta?: string;

  // Contexto de usuario para aplicar reglas de visibilidad en MS
  @IsOptional()
  @IsInt()
  @Min(1)
  idUsuario?: number;

  @IsOptional()
  roles?: string[];

  // Scopes: explicitar si queremos listar por dueño/tecnico
  @IsOptional()
  @IsInt()
  @Min(1)
  idCliente?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  idTecnico?: number;

  // Filtro por tipo de gestión
  @IsOptional()
  @IsInt()
  @Min(1)
  idTipoGestion?: number;

  // Filtro por estado textual (igualdad)
  @IsOptional()
  estado?: string;
}
