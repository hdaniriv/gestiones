# Gestión (Microservicio)

Servicio NestJS (microservicio TCP) para gestionar clientes, empleados y gestiones.

## Requisitos
- Node.js 18+
- Docker (para Postgres)

## Variables de entorno
Ver `.env.example`. Para desarrollo, usa `.env.development`.



## Instalar dependencias y arrancar
```powershell
npm install
npm run start:dev:with-db  # levanta DB y arranca el servicio
# o
npm run start:dev
```


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
- gestiones.create.v1 { dto, userContext } 
- gestiones.findAll.v1
- gestiones.findById.v1 { id }
- gestiones.update.v1 { id, dto, userContext }
- gestiones.delete.v1 { id }
- gestiones.search.v1 { query, userContext }
- gestiones.sinTecnico.v1 { query }
- health.ping { userContext? }


