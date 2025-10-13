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
        // Logging configurable: "false" | "true" | "error" | "query,error" ...
        logging: ((): boolean | ("query" | "error" | "schema" | "warn" | "info" | "log" | "migration")[] => {
          const raw = (config.get<string>('DB_LOGGING', 'error') || '').trim().toLowerCase();
          if (raw === 'true') return true;
          if (raw === 'false' || raw === '') return false;
          // Permitir lista separada por comas (ej: "error,warn")
          return raw.split(',').map(v => v.trim()) as any;
        })(),
        ssl: false,
      }),
    }),
  ],
})
export class PersistenceModule {}
