-- Crear esquema 'public' solo si no existe (evita error en entornos donde ya está creado)
CREATE SCHEMA IF NOT EXISTS public;

-- public.cliente definition

-- Drop table

-- DROP TABLE public.cliente;

CREATE TABLE public.cliente (
	id serial4 NOT NULL,
	"fechaCreacion" timestamptz DEFAULT now() NOT NULL,
	"fechaModificacion" timestamptz DEFAULT now() NOT NULL,
	id_usuario_creador int4 NOT NULL,
	nombre varchar(150) NOT NULL,
	direccion varchar(200) NOT NULL,
	telefono varchar(50) NOT NULL,
	correo varchar(100) NULL,
	nit varchar(50) NOT NULL,
	latitud numeric(10, 7) NOT NULL,
	longitud numeric(10, 7) NOT NULL,
	id_usuario int4 NULL,
	CONSTRAINT "PK_18990e8df6cf7fe71b9dc0f5f39" PRIMARY KEY (id)
);
CREATE UNIQUE INDEX "IDX_3a722445847d37bb66f41e1c16" ON public.cliente USING btree (nit);


-- public.empleado definition

-- Drop table

-- DROP TABLE public.empleado;

CREATE TABLE public.empleado (
	id serial4 NOT NULL,
	"fechaCreacion" timestamptz DEFAULT now() NOT NULL,
	"fechaModificacion" timestamptz DEFAULT now() NOT NULL,
	id_usuario_creador int4 NOT NULL,
	nombres varchar(100) NOT NULL,
	apellidos varchar(100) NOT NULL,
	telefono varchar(50) NULL,
	direccion varchar(200) NULL,
	"idEmpleadoTipo" int4 NOT NULL,
	"idUsuario" int4 NULL,
	CONSTRAINT "PK_d15e7688d5ed23e9fdb570b2e5d" PRIMARY KEY (id)
);


-- public."empleadoTipo" definition

-- Drop table

-- DROP TABLE public."empleadoTipo";

CREATE TABLE public."empleadoTipo" (
	id serial4 NOT NULL,
	"fechaCreacion" timestamptz DEFAULT now() NOT NULL,
	"fechaModificacion" timestamptz DEFAULT now() NOT NULL,
	id_usuario_creador int4 NOT NULL,
	nombre varchar(100) NOT NULL,
	descripcion varchar(255) NULL,
	CONSTRAINT "PK_d8f3a75a31a2bf0bd2b9467c8ad" PRIMARY KEY (id)
);
CREATE UNIQUE INDEX "IDX_8dc02d323ba5ce2b3c8c1b204b" ON public."empleadoTipo" USING btree (nombre);


-- public.gestion definition

-- Drop table

-- DROP TABLE public.gestion;

CREATE TABLE public.gestion (
	id serial4 NOT NULL,
	"fechaCreacion" timestamptz DEFAULT now() NOT NULL,
	"fechaModificacion" timestamptz DEFAULT now() NOT NULL,
	id_usuario_creador int4 NOT NULL,
	codigo varchar(6) NOT NULL,
	"idCliente" int4 NOT NULL,
	"idTecnico" int4 NULL,
	"idTipoGestion" int4 NOT NULL,
	direccion varchar(200) NOT NULL,
	latitud numeric(10, 7) NULL,
	longitud numeric(10, 7) NULL,
	"fechaProgramada" timestamp NOT NULL,
	"fechaInicio" timestamp NULL,
	"fechaFin" timestamp NULL,
	observaciones varchar(1000) NULL,
	estado varchar(50) DEFAULT 'Pendiente'::character varying NOT NULL,
	CONSTRAINT "PK_63af1484eb3fe240390c2243751" PRIMARY KEY (id),
	CONSTRAINT "UQ_88a0cbf91befd2af63a466c31d9" UNIQUE (codigo)
);


-- public."supervisorTecnico" definition

-- Drop table

-- DROP TABLE public."supervisorTecnico";

CREATE TABLE public."supervisorTecnico" (
	id serial4 NOT NULL,
	"fechaCreacion" timestamptz DEFAULT now() NOT NULL,
	"fechaModificacion" timestamptz DEFAULT now() NOT NULL,
	id_usuario_creador int4 NOT NULL,
	"idSupervisor" int4 NOT NULL,
	"idTecnico" int4 NOT NULL,
	CONSTRAINT "PK_b9da8583f987eda9112cf6db603" PRIMARY KEY (id)
);


-- public."tipoGestion" definition

-- Drop table

-- DROP TABLE public."tipoGestion";

CREATE TABLE public."tipoGestion" (
	id serial4 NOT NULL,
	"fechaCreacion" timestamptz DEFAULT now() NOT NULL,
	"fechaModificacion" timestamptz DEFAULT now() NOT NULL,
	id_usuario_creador int4 NOT NULL,
	nombre varchar(100) NOT NULL,
	descripcion varchar(255) NULL,
	CONSTRAINT "PK_27f7958cf7f2ee3ee3d0bfcbbb8" PRIMARY KEY (id)
);
CREATE UNIQUE INDEX "IDX_d440ac0f9fc05e96bac410bd93" ON public."tipoGestion" USING btree (nombre);
