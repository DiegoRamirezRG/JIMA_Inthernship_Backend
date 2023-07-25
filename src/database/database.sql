CREATE DATABASE jima_internship CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE jima_internship;

CREATE TABLE persona(
    ID_Persona CHAR(36) DEFAULT (UUID()) NOT NULL PRIMARY KEY,
    Nombre VARCHAR(50) NOT NULL,
    Apellido_Paterno VARCHAR(50) NOT NULL,
    Apellido_Materno VARCHAR(50) NULL,
    CURP VARCHAR(18) NULL,
    Genero ENUM('Masculino', 'Femenino', 'Otro') NOT NULL,
    Fecha_De_Nacimiento DATE NOT NULL,
    Tipo_De_Sagre ENUM('A', 'B', 'AB', 'O', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-') NOT NULL,
    Numero_De_Emergencia BIGINT NULL,
    Numero_De_Telefono BIGINT NOT NULL,
    Nacionalidad VARCHAR(100),
    Correo_Electronico TEXT NOT NULL UNIQUE,
    Rol ENUM('Estudiante', 'Profesor', 'Administrativo', 'Padre') NOT NULL,
    Active BOOLEAN DEFAULT true,
    Creado_En DATETIME NOT NULL DEFAULT NOW(),
    Actualizado_EN DATETIME NULL
);

CREATE TABLE credenciales(
    ID_Credencial CHAR(36) DEFAULT (UUID()) NOT NULL PRIMARY KEY,
    FK_Persona CHAR(36) NOT NULL,
    Correo TEXT NOT NULL UNIQUE,
    Contraseña TEXT NOT NULL,
    Numero_De_Intentos INT NOT NULL DEFAULT 0,
    Ultimo_Intento DATETIME NULL,
    Inicio_De_Sesion DATETIME NULL,
    Fin_De_Sesion DATETIME NULL,
    Token_De_Sesion TEXT NULL,
    Creado_En DATETIME NOT NULL DEFAULT NOW(),
    Actualizado_EN DATETIME NULL,
    FOREIGN KEY ( FK_Persona ) REFERENCES persona(ID_Persona)
);

CREATE TABLE direccion(
    ID_Direccion CHAR(36) DEFAULT (UUID()) NOT NULL PRIMARY KEY,
    FK_Persona CHAR(36) NOT NULL,
    Ciudad TEXT NOT NULL,
    Estado TEXT NOT NULL,
    Pais TEXT NOT NULL,
    Codigo_Postal TEXT NOT NULL,
    Numero_Interior TEXT NULL,
    Numero_Exterior TEXT NOT NULL,
    Creado_En DATETIME NOT NULL DEFAULT NOW(),
    Actualizado_EN DATETIME NULL,
    FOREIGN KEY (FK_Persona) REFERENCES persona(ID_Persona)
);

CREATE TABLE alergias(
    ID_Alergia CHAR(36) DEFAULT (UUID()) NOT NULL PRIMARY KEY,
    Nombre VARCHAR(50) NOT NULL,
    Descripcion TEXT NOT NULL,
    FK_Persona CHAR(36) NOT NULL,
    Creado_En DATETIME NOT NULL DEFAULT NOW(),
    Actualizado_EN DATETIME NULL,
    FOREIGN KEY (FK_Persona) REFERENCES persona(ID_Persona)
);

CREATE TABLE estudiante(
    ID_Estudiante CHAR(36) DEFAULT (UUID()) NOT NULL PRIMARY KEY,
    FK_Persona CHAR(36) NOT NULL,
    Matricula TEXT NOT NULL DEFAULT (UUID()),
    URL TEXT NULL,
    Titulado BOOLEAN NOT NULL DEFAULT false,
    Creado_En DATETIME NOT NULL DEFAULT NOW(),
    Actualizado_EN DATETIME NULL,
    FOREIGN KEY (FK_Persona) REFERENCES persona(ID_Persona)
);

CREATE TABLE administrativos(
    ID_Administrativos CHAR(36) DEFAULT (UUID()) NOT NULL PRIMARY KEY,
    FK_Persona CHAR(36) NOT NULL,
    Codigo_De_Administrativo TEXT NOT NULL DEFAULT (UUID()),
    NSS TEXT NOT NULL,
    Fecha_De_Contratacion DATETIME NOT NULL,
    URL TEXT NULL,
    Creado_En DATETIME NOT NULL DEFAULT NOW(),
    Actualizado_EN DATETIME NULL,
    FOREIGN KEY (FK_Persona) REFERENCES persona(ID_Persona)
);

CREATE TABLE profesor(
    ID_Profesor CHAR(36) DEFAULT (UUID()) NOT NULL,
    FK_Persona CHAR(36) NOT NULL,
    Codigo_De_Profesor TEXT NOT NULL DEFAULT (UUID()),
    NSS TEXT NOT NULL,
    Fecha_De_Contratacion DATETIME NOT NULL,
    URL TEXT NULL,
    Creado_En DATETIME NOT NULL DEFAULT NOW(),
    Actualizado_EN DATETIME NULL,
    FOREIGN KEY (FK_Persona) REFERENCES persona(ID_Persona)
);