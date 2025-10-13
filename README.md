# Gestión (Microservicio)

Servicio NestJS (microservicio TCP) para gestionar clientes.

## Requisitos
- Node.js 18+
- Docker (para Postgres)

## Variables de entorno
Ver `.env.example`. Para desarrollo, usa `.env.development`.

## Levantar Postgres
Opción A: manual
```powershell
cd C:\Daniel\Programacion\javascript\micro_sistema\gestion
docker compose up -d
```

Opción B: scripts npm
```powershell
npm run db:up     # inicia contenedor
npm run db:logs   # sigue logs
npm run db:down   # detiene y elimina contenedor
```

## Instalar dependencias y arrancar
```powershell
cd C:\Daniel\Programacion\javascript\micro_sistema\gestion
npm install
npm run start:dev:with-db  # levanta DB y arranca el servicio
# o
npm run start:dev
```

El servicio escucha por TCP en `127.0.0.1:4010`.

## Patrones RPC
- clientes.create.v1 { dto, userContext }
- clientes.findAll.v1
- clientes.findById.v1 { id }
- clientes.update.v1 { id, dto }
- clientes.delete.v1 { id }
- health.ping { userContext? }

## Entidades
- ClienteEntity (hereda de BaseEntity)
