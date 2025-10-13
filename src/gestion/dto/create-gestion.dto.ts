import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateGestionDto {
  @IsInt() @Min(1) idCliente!: number;
  @IsOptional() @IsInt() @Min(1) idTecnico?: number;
  @IsInt() @Min(1) idTipoGestion!: number;
  @IsString() @IsNotEmpty() @MaxLength(200) direccion!: string;
  @IsOptional() latitud?: number;
  @IsOptional() longitud?: number;
  @IsDateString() fechaProgramada!: string;
  @IsOptional() @IsDateString() fechaInicio?: string;
  @IsOptional() @IsDateString() fechaFin?: string;
  @IsOptional() @IsString() @MaxLength(1000) observaciones?: string;
  @IsOptional() @IsString() @MaxLength(50) estado?: string;
}
