INSERT INTO persona (
    Nombre,
    Apellido_Paterno,
    Apellido_Materno,
    CURP,
    Genero,
    Fecha_De_Nacimiento,
    Tipo_De_Sagre,
    Numero_De_Emergencia,
    Numero_De_Telefono,
    Nacionalidad,
    Correo_Electronico,
    Rol
) VALUES (
    'Diego Guadalupe',
    'Ramirez',
    'Reyes',
    'RARD011008HJCMYGA7',
    'Masculino',
    '2001-10-08',
    'O+',
    3487895811,
    3481098523,
    'Mexicano',
    'dieghoramreyes@gmail.com',
    'Administrativo'
);

INSERT INTO credenciales(
    FK_Persona,
    Correo,
    Contraseña
) VALUES (
    'b13ef322-2b00-11ee-b4a5-0800274fe67a',
    'dieghoramreyes@gmail.com',
    '5914af360a493b7cd046d15bc04c0b9f'
)