CREATE DATABASE jima_internship CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE jima_internship;

-- User Information

CREATE TABLE persona(
    Creado_Por CHAR(36) DEFAULT (UUID()) NOT NULL PRIMARY KEY,
    Nombre VARCHAR(50) NOT NULL,
    Apellido_Paterno VARCHAR(50) NOT NULL,
    Apellido_Materno VARCHAR(50) NULL,
    CURP VARCHAR(18) NULL UNIQUE,
    Genero ENUM('Masculino', 'Femenino', 'Otro') NOT NULL,
    Fecha_De_Nacimiento DATE NOT NULL,
    Tipo_De_Sagre ENUM('A', 'B', 'AB', 'O', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-') NOT NULL,
    Numero_De_Emergencia BIGINT NULL,
    Numero_De_Telefono BIGINT NOT NULL,
    Nacionalidad VARCHAR(100) NULL,
    Correo_Electronico VARCHAR(255) NOT NULL UNIQUE,
    Rol ENUM('Estudiante', 'Profesor', 'Administrativo', 'Padre') NOT NULL,
    Active BOOLEAN DEFAULT true,
    Imagen TEXT NULL DEFAULT(null),
    Creado_En DATETIME NOT NULL DEFAULT NOW(),
    Actualizado_EN DATETIME NULL
);

CREATE TABLE credenciales(
    ID_Credencial CHAR(36) DEFAULT (UUID()) NOT NULL PRIMARY KEY,
    FK_Persona CHAR(36) NOT NULL,
    Correo VARCHAR(255) NOT NULL UNIQUE,
    Contraseña TEXT NOT NULL,
    Numero_De_Intentos INT NOT NULL DEFAULT 0,
    Ultimo_Intento DATETIME NULL,
    Inicio_De_Sesion DATETIME NULL,
    Fin_De_Sesion DATETIME NULL,
    Token_De_Sesion TEXT NULL,
    Creado_En DATETIME NOT NULL DEFAULT NOW(),
    Actualizado_EN DATETIME NULL,
    FOREIGN KEY ( FK_Persona ) REFERENCES persona(ID_Persona) ON UPDATE CASCADE ON DELETE CASCADE
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
    Calle TEXT NOT NULL,
    Creado_En DATETIME NOT NULL DEFAULT NOW(),
    Actualizado_EN DATETIME NULL,
    FOREIGN KEY (FK_Persona) REFERENCES persona(ID_Persona) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE alergias(
    ID_Alergia CHAR(36) DEFAULT (UUID()) NOT NULL PRIMARY KEY,
    Nombre VARCHAR(50) NOT NULL,
    Descripcion TEXT NULL,
    FK_Persona CHAR(36) NOT NULL,
    Creado_En DATETIME NOT NULL DEFAULT NOW(),
    Actualizado_EN DATETIME NULL,
    FOREIGN KEY (FK_Persona) REFERENCES persona(ID_Persona) ON UPDATE CASCADE ON DELETE CASCADE
);

-- Roles Data

CREATE TABLE estudiante(
    ID_Estudiante CHAR(36) DEFAULT (UUID()) NOT NULL PRIMARY KEY,
    FK_Persona CHAR(36) NOT NULL,
    Matricula TEXT NOT NULL DEFAULT (UUID()),
    URL TEXT NULL,
    Titulado BOOLEAN NOT NULL DEFAULT false,
    Creado_En DATETIME NOT NULL DEFAULT NOW(),
    Actualizado_EN DATETIME NULL,
    FOREIGN KEY (FK_Persona) REFERENCES persona(ID_Persona) ON UPDATE CASCADE ON DELETE CASCADE
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
    FOREIGN KEY (FK_Persona) REFERENCES persona(ID_Persona) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE profesor(
    ID_Profesor CHAR(36) DEFAULT (UUID()) NOT NULL PRIMARY KEY,
    FK_Persona CHAR(36) NOT NULL,
    Codigo_De_Profesor TEXT NOT NULL DEFAULT (UUID()),
    NSS TEXT NOT NULL,
    Fecha_De_Contratacion DATETIME NOT NULL,
    URL TEXT NULL,
    Creado_En DATETIME NOT NULL DEFAULT NOW(),
    Actualizado_EN DATETIME NULL,
    FOREIGN KEY (FK_Persona) REFERENCES persona(ID_Persona) ON UPDATE CASCADE ON DELETE CASCADE
);

-- Ciclos Escolares

CREATE TABLE grados(
    ID_Grado CHAR(36) DEFAULT (UUID()) NOT NULL PRIMARY KEY,
    Numero INT NOT NULL UNIQUE,
    Descripcion TEXT NULL,
    Active BOOLEAN DEFAULT(1),
    Creado_En DATETIME NOT NULL DEFAULT NOW(),
    Actualizado_EN DATETIME NULL
);

CREATE TABLE grupos(
    ID_Grupo CHAR(36) DEFAULT (UUID()) NOT NULL PRIMARY KEY,
    Indicador VARCHAR(10) NOT NULL UNIQUE,
    Active BOOLEAN DEFAULT(1),
    Creado_En DATETIME NOT NULL DEFAULT NOW(),
    Actualizado_EN DATETIME NULL
);

CREATE TABLE turnos(
    ID_Turno CHAR(36) DEFAULT (UUID()) NOT NULL PRIMARY KEY,
    Nombre VARCHAR(10) NOT NULL,
    Hora_Inicio TIME NOT NULL,
    Hora_Fin TIME NOT NULL,
    Active BOOLEAN DEFAULT(1),
    Creado_En DATETIME NOT NULL DEFAULT NOW(),
    Actualizado_EN DATETIME NULL
);

-- Carreras

CREATE TABLE carrera(
    ID_Carrera CHAR(36) DEFAULT (UUID()) NOT NULL PRIMARY KEY,
    Nombre VARCHAR(50) NOT NULL,
    Numero_De_Ciclos INT NOT NULL,
    Duracion_Mensual_De_Ciclos INT NOT NULL,
    Descripcion TEXT NULL,
    Active BOOLEAN DEFAULT(1),
    Creado_En DATETIME NOT NULL DEFAULT NOW(),
    Actualizado_EN DATETIME NULL
);

-- Aspirantes

CREATE TABLE aspirante_helper(
    ID_Aspirante CHAR(36) DEFAULT (UUID()) NOT NULL PRIMARY KEY,
    FK_Estudiante CHAR(36) NOT NULL,
    FK_Carrera CHAR(36) NOT NULL,
    Creado_En DATETIME NOT NULL DEFAULT NOW(),
    Actualizado_EN DATETIME NULL,
    FOREIGN KEY(FK_Estudiante) REFERENCES estudiante(ID_Estudiante) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY(FK_Carrera) REFERENCES carrera(ID_Carrera) ON UPDATE CASCADE ON DELETE CASCADE
);

-- Planes Academicos

CREATE TABLE area(
    ID_Area CHAR(36) DEFAULT (UUID()) NOT NULL PRIMARY KEY,
    Nombre VARCHAR(50) NOT NULL,
    Descripcion TEXT NULL,
    Codigo_De_Area VARCHAR(10) NOT NULL,
    Active BOOLEAN DEFAULT(1),
    Creado_En DATETIME NOT NULL DEFAULT NOW(),
    Actualizado_EN DATETIME NULL
);

CREATE TABLE materia(
    ID_Materia CHAR(36) DEFAULT (UUID()) NOT NULL PRIMARY KEY,
    Nombre VARCHAR(50) NOT NULL,
    Descripcion TEXT NULL,
    Codigo_De_Materia TEXT NOT NULL,
    Creditos INT,
    Horas_De_Clase INT,
    FK_Area CHAR(36) NOT NULL,
    Actice BOOLEAN DEFAULT(1),
    Creado_En DATETIME NOT NULL DEFAULT NOW(),
    Actualizado_EN DATETIME NULL,
    FOREIGN KEY(FK_Area) REFERENCES area(ID_Area) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE carrera_plan_academico(
    ID_Carrera_Plan_Academico CHAR(36) DEFAULT (UUID()) NOT NULL PRIMARY KEY,
    FK_Carrera CHAR(36) NOT NULL,
    Active BOOLEAN DEFAULT(1),
    Creado_En DATETIME NOT NULL DEFAULT NOW(),
    Actualizado_EN DATETIME NULL,
    FOREIGN KEY (FK_Carrera) REFERENCES carrera(ID_Carrera) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE detalle_plan_academico(
    ID_Detaller_Plan CHAR(36) DEFAULT (UUID()) NOT NULL PRIMARY KEY,
    FK_Carrera_Plan_Academico CHAR(36) NOT NULL,
    FK_Materia CHAR(36) NOT NULL,
    Ciclo_A_Impartir INT,
    Materia_Previa CHAR(36) NULL,
    Creado_En DATETIME NOT NULL DEFAULT NOW(),
    Actualizado_EN DATETIME NULL,
    FOREIGN KEY (FK_Carrera_Plan_Academico) REFERENCES carrera_plan_academico(ID_Carrera_Plan_Academico) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (FK_Materia) REFERENCES materia(ID_Materia) ON UPDATE CASCADE ON DELETE CASCADE
);

-- Inscripciones
CREATE TABLE inscripciones(
    ID_Inscripciones CHAR(36) DEFAULT (UUID()) NOT NULL PRIMARY KEY,
    FK_Estudiante CHAR(36) NOT NULL,
    FK_Carrera CHAR(36) NOT NULL,
    FK_Grado CHAR(36) NOT NULL,
    FK_Grupo CHAR(36) NOT NULL,
    FK_Turno CHAR(36) NOT NULL,
    Pagado BOOLEAN DEFAULT(0),
    Active BOOLEAN DEFAULT(1),
    Creado_En DATETIME NOT NULL DEFAULT NOW(),
    Actualizado_EN DATETIME NULL,
    FOREIGN KEY (FK_Estudiante) REFERENCES estudiante(ID_Estudiante) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (FK_Carrera) REFERENCES carrera(ID_Carrera) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (FK_Grado) REFERENCES grados(ID_Grado) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (FK_Grupo) REFERENCES grupos(ID_Grupo) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (FK_Turno) REFERENCES turnos(ID_Turno) ON UPDATE CASCADE ON DELETE CASCADE
);

--Calendario
CREATE TABLE calendario(
    ID_Calendario CHAR(36) DEFAULT (UUID()) NOT NULL PRIMARY KEY,
    Nombre VARCHAR(50) NOT NULL,
    Inicio DATETIME NOT NULL,
    Fin DATETIME NOT NULL,
    Active BOOLEAN DEFAULT(1),
    Creado_En DATETIME NOT NULL DEFAULT NOW(),
    Actualizado_EN DATETIME NULL
);

CREATE TABLE calendario_eventos(
    ID_Calendario_Eventos CHAR(36) DEFAULT (UUID()) NOT NULL PRIMARY KEY,
    Titulo VARCHAR(50) NOT NULL,
    Descripcion TEXT NULL,
    Fecha_Inicio DATETIME NOT NULL,
    Fecha_Fin DATETIME NULL,
    Color VARCHAR(8) NOT NULL,
    FK_Calendario CHAR(36) NOT NULL,
    Creado_En DATETIME NOT NULL DEFAULT NOW(),
    Actualizado_EN DATETIME NULL,
    FOREIGN KEY(FK_Calendario) REFERENCES calendario(ID_Calendario) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE handler_ciclo_escolar(
    ID_Handler_Ciclo_Escolar CHAR(36) DEFAULT (UUID()) NOT NULL PRIMARY KEY,
    FK_Calendario CHAR(36) NOT NULL,
    Ciclo_Iniciado BOOLEAN DEFAULT(0),
    Ciclo_Conf_Term BOOLEAN DEFAULT(0),
    FOREIGN KEY(FK_Calendario) REFERENCES calendario(ID_Calendario) ON UPDATE CASCADE ON DELETE CASCADE
)

--Profesor, Alumno, Clase
CREATE TABLE clase(
    ID_Clase CHAR(36) DEFAULT (UUID()) NOT NULL PRIMARY KEY,
    FK_Materia CHAR(36) NOT NULL,
    FK_Profesor CHAR(36) NOT NULL,
    Active BOOLEAN DEFAULT(1),
    Creado_En DATETIME NOT NULL DEFAULT NOW(),
    Actualizado_EN DATETIME NULL,
    FOREIGN KEY(FK_Materia) REFERENCES materia(ID_Materia) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY(FK_Profesor) REFERENCES profesor(ID_Profesor) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE table estudiante_clases(
    ID_Estudiante_Clases CHAR(36) DEFAULT (UUID()) NOT NULL PRIMARY KEY,
    FK_Estudiante CHAR(36) NOT NULL,
    FK_Clase CHAR(36) NOT NULL,
    Creado_En DATETIME NOT NULL DEFAULT NOW(),
    Actualizado_EN DATETIME NULL,
    FOREIGN KEY(FK_Estudiante) REFERENCES estudiante(ID_Estudiante) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY(FK_Clase) REFERENCES clase(ID_Clase) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE horario(
    ID_Horario CHAR(36) DEFAULT (UUID()) NOT NULL PRIMARY KEY,
    Dia ENUM('Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado') NOT NULL,
    Hora_Inicio TIME NOT NULL,
    Hora_Fin TIME NOT NULL,
    FK_Clase CHAR(36) NOT NULL,
    Creado_En DATETIME NOT NULL DEFAULT NOW(),
    Actualizado_EN DATETIME NULL,
    FOREIGN KEY(FK_Clase) REFERENCES clase(ID_Clase) ON UPDATE CASCADE ON DELETE CASCADE
);

--Asignaciones
CREATE TABLE rubrica(
    ID_Rubrica CHAR(36) DEFAULT (UUID()) NOT NULL PRIMARY KEY,
    Active BOOLEAN DEFAULT(1),
    Creado_Por CHAR(36) NOT NULL,
    Creado_En DATETIME NOT NULL DEFAULT NOW(),
    Actualizado_EN DATETIME NULL,
    FOREIGN KEY(Creado_Por) REFERENCES persona(ID_Persona) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE detalle_rubrica(
    ID_Detalle_Rubrica CHAR(36) DEFAULT (UUID()) NOT NULL PRIMARY KEY,
    FK_Rubrica CHAR(36) NOT NULL,
    Nombre VARCHAR(30) NOT NULL,
    Descripcion TEXT NULL,
    Valor INT NOT NULL,
    Creado_En DATETIME NOT NULL DEFAULT NOW(),
    Actualizado_EN DATETIME NULL,
    FOREIGN KEY(FK_Rubrica) REFERENCES rubrica(ID_Rubrica) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE unidad(
    ID_Unidad CHAR(36) DEFAULT (UUID()) NOT NULL PRIMARY KEY,
    FK_Clase CHAR(36) NOT NULL,
    Nombre VARCHAR(100),
    FK_Rubrica CHAR(36) NULL,
    Creado_En DATETIME NOT NULL DEFAULT NOW(),
    Actualizado_EN DATETIME NULL,
    FOREIGN KEY(FK_Clase) REFERENCES clase(ID_Clase) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY(FK_Rubrica) REFERENCES rubrica(ID_Rubrica) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE actividad(
    ID_Actividad CHAR(36) DEFAULT (UUID()) NOT NULL PRIMARY KEY,
    Titulo VARCHAR(100) NOT NULL,
    Descripcion TEXT NULL,
    Fecha_De_Entrega DATETIME NULL,
    FK_Clase CHAR(36) NOT NULL,
    FK_Rubrica CHAR(36) NULL,
    Fk_Unidad CHAR(36) NULL,
    Active BOOLEAN DEFAULT(1),
    Alumnos_Actividad JSON NULL,
    Requiere_Anexos BOOLEAN DEFAULT(0),
    Acepta_Despues BOOLEAN DEFAULT(0),
    Calificable BOOLEAN DEFAULT(0),
    Creado_En DATETIME NOT NULL DEFAULT NOW(),
    Actualizado_EN DATETIME NULL,
    FOREIGN KEY(FK_Clase) REFERENCES clase(ID_Clase) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY(FK_Rubrica) REFERENCES rubrica(ID_Rubrica) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY(Fk_Unidad) REFERENCES unidad(ID_Unidad) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE actividad_anexos(
    ID_Actividad_Anexo CHAR(36) DEFAULT (UUID()) NOT NULL PRIMARY KEY,
    FK_Actividad CHAR(36) NOT NULL,
    Nombre_Del_Archivo TEXT NOT NULL,
    Creado_En DATETIME NOT NULL DEFAULT NOW(),
    Actualizado_EN DATETIME NULL,
    FOREIGN KEY(FK_Actividad) REFERENCES actividad(ID_Actividad) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE entregas(
    ID_Entregas CHAR(36) DEFAULT (UUID()) NOT NULL PRIMARY KEY,
    FK_Actividad CHAR(36) NOT NULL,
    FK_Estudiante CHAR(36) NOT NULL,
    Anexos JSON NULL,
    Calificacion INT NULL,
    Creado_En DATETIME NOT NULL DEFAULT NOW(),
    Actualizado_EN DATETIME NULL,
    FOREIGN KEY(FK_Actividad) REFERENCES actividad(ID_Actividad) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY(FK_Estudiante) REFERENCES estudiante(ID_Estudiante) ON UPDATE CASCADE ON DELETE CASCADE
);