-- Database: empleado

-- DROP DATABASE IF EXISTS empleado;

select * from usuarios

CREATE DATABASE empleado
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'Spanish_Colombia.1252'
    LC_CTYPE = 'Spanish_Colombia.1252'
    LOCALE_PROVIDER = 'libc'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;
	
	
	
	-- Crear la tabla Empleado
CREATE TABLE Empleado (
    ID SERIAL PRIMARY KEY,
    NOMBRE VARCHAR(50),
    TIPO INTEGER,
    FECHA_INGRESO DATE,
    SALARIO NUMERIC
);

-- Crear la tabla Solicitud
CREATE TABLE Solicitud (
    ID SERIAL PRIMARY KEY,
    NOMBRE VARCHAR(50),
    DESCRIPCION VARCHAR(50),
    RESUMEN VARCHAR(50),
    ID_EMPLEADO INTEGER,
    FOREIGN KEY (ID_EMPLEADO) REFERENCES Empleado(ID)
);


CREATE TABLE Usuarios (
    ID SERIAL PRIMARY KEY,
    NOMBRE VARCHAR(50),
    EMAIL VARCHAR(50) UNIQUE NOT NULL,
    PASSWORD VARCHAR(255) NOT NULL,
    ROL VARCHAR(20) NOT NULL
);


-- Insertar datos en la tabla Empleado
INSERT INTO Empleado (NOMBRE, TIPO, FECHA_INGRESO, SALARIO) VALUES
('Juan Pérez', 1, '2020-01-15', 3000),
('Ana Gómez', 2, '2019-03-22', 3500),
('Carlos López', 1, '2021-07-01', 2800);

-- Insertar datos en la tabla Solicitud
INSERT INTO Solicitud (NOMBRE, DESCRIPCION, RESUMEN, ID_EMPLEADO) VALUES
('Solicitud A', 'Descripción A', 'Resumen A', 1),
('Solicitud B', 'Descripción B', 'Resumen B', 2),
('Solicitud C', 'Descripción C', 'Resumen C', 1);

-- Usuario Administrador
INSERT INTO Usuarios (NOMBRE, EMAIL, PASSWORD, ROL) 
VALUES ('Administrador', 'admin@example.com', '1', 'Administrador');

-- Usuario Empleado vinculado al Empleado ID 1 (Juan Pérez)
INSERT INTO Usuarios (NOMBRE, EMAIL, PASSWORD, ROL) 
VALUES ('Juan Pérez', 'juan.perez@example.com', '2', 'Empleado');

-- Usuario Empleado vinculado al Empleado ID 2 (Ana Gómez)
INSERT INTO Usuarios (NOMBRE, EMAIL, PASSWORD, ROL) 
VALUES ('Ana Gómez', 'ana.gomez@example.com', '3', 'Empleado');


