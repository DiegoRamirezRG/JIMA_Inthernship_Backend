---Delete this file is just testings

SELECT 
	*
FROM
    inscripciones AS i,
    estudiante AS e,
    persona AS p,
    carrera AS c,
    grados AS gra,
    grupos AS gru,
    turnos AS t
WHERE
    i.FK_Estudiante = e.ID_Estudiante AND
    e.ID_Estudiante = p.ID_Persona AND
    i.FK_Carrera = c.ID_Carrera AND
    i.FK_Grado = gra.ID_Grado AND
    i.FK_Grupo = gru.ID_Grupo AND
    i.FK_Turno = t.ID_Turno AND
    i.Active = TRUE
ORDER BY
    FK_Turno, FK_Carrera, FK_Grado, FK_Grupo

