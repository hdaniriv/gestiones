import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST', '127.0.0.1'),
        port: parseInt(config.get<string>('DB_PORT', '5432'), 10),
        username: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME', 'gestion'),
        // Cargar automáticamente las entidades registradas vía TypeOrmModule.forFeature
        autoLoadEntities: true,
        synchronize: config.get<string>('DB_SYNC', 'true') === 'true',
        // Solo registrar errores de base de datos
        logging: ['error'],
        // SSL configurable para proveedores gestionados (Neon/Supabase/etc.)
        ssl:
          config.get<string>("DB_SSL", "false") === "true"
            ? { rejectUnauthorized: false }
            : false,
      }),
    }),
  ],
})
export class PersistenceModule {}
