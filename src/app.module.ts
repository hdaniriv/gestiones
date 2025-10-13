import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClienteModule } from './cliente/cliente.module';
import { EmpleadoTipoModule } from './empleado-tipo/empleado-tipo.module';
import { EmpleadoModule } from './empleado/empleado.module';
import { SupervisorTecnicoModule } from './supervisor-tecnico/supervisor-tecnico.module';
import { TipoGestionModule } from './tipo-gestion/tipo-gestion.module';
import { GestionModule } from './gestion/gestion.module';
import { PersistenceModule } from './persistence/persistence.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development',
    }),
    PersistenceModule,
    HealthModule,
    ClienteModule,
    EmpleadoTipoModule,
    EmpleadoModule,
    SupervisorTecnicoModule,
    TipoGestionModule,
    GestionModule,
  ],
})
export class AppModule {}
