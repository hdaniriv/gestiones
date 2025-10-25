import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import 'reflect-metadata';
import { AppModule } from './app.module';

async function bootstrap() {
  // En Fly, el DNS interno (app.internal) resuelve a IPv6 (AAAA). Para aceptar conexiones IPv6
  // y evitar ECONNREFUSED desde otros servicios, escuchamos en '::' por defecto.
  // En desarrollo local puedes exportar MS_HOST=127.0.0.1 si prefieres IPv4.
  const host = process.env.MS_HOST || '::';
  const port = parseInt(process.env.PORT || '4010', 10);

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.TCP,
    options: { host, port },
  });

  // Validación global para mensajes RPC (transform y whitelist)
  // Nota: La validación de objetos anidados requiere DTOs adecuados con ValidateNested/Type
  // cuando el payload contiene propiedades como { dto: {...} }
  // Aquí habilitamos una validación base a nivel global.
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  await app.listen();
  // eslint-disable-next-line no-console
  console.log(`Gestion service listening on tcp://${host}:${port}`);
}

bootstrap();
