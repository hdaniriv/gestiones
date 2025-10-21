# Gestión (Microservicio)

Servicio NestJS (microservicio TCP) para gestionar clientes, empleados y gestiones.

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
- empleados.findAll.v1
- empleados.findById.v1 { id }
- empleados.findByUsuario.v1 { idUsuario }
- empleados.findBySupervisor.v1 { idSupervisor }
- gestiones.create.v1 { dto, userContext }  // genera codigo YYNNNN automáticamente
- gestiones.findAll.v1
- gestiones.findById.v1 { id }
- gestiones.update.v1 { id, dto, userContext }
- gestiones.delete.v1 { id }
- gestiones.search.v1 { query, userContext }
- gestiones.sinTecnico.v1 { query }
- health.ping { userContext? }

## Entidades
- BaseEntity: id, fechaCreacion, fechaModificacion, idUsuarioCreador
- ClienteEntity
- EmpleadoEntity
- EmpleadoTipoEntity
- SupervisorTecnicoEntity
- TipoGestionEntity
- GestionEntity
	- codigo: varchar(6), único, formato YYNNNN (p.ej., 250001). Se genera en create(), no editable.
	- idCliente, idTecnico?, idTipoGestion, direccion, latitud?, longitud?, fechaProgramada, fechaInicio?, fechaFin?, observaciones?, estado

## Notas sobre código de gestión
- El código se genera de forma encapsulada en create().
- Prefijo: últimos dos dígitos del año actual.
- Correlativo: 4 dígitos, se incrementa por año y se reinicia cada año.
- En concurrencia, si ocurre colisión de clave única, se reintenta hasta 3 veces.
