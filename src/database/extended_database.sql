CREATE TABLE papa(
    ID_Papa CHAR(36) DEFAULT (UUID()) NOT NULL,
    FK_Persona CHAR(36) NOT NULL,
    FK_Hijo  CHAR(36) NOT NULL,
    FOREIGN KEY (FK_Persona) REFERENCES persona(ID_Persona),
    FOREIGN KEY (FK_Hijo) REFERENCES persona(ID_Persona)
);