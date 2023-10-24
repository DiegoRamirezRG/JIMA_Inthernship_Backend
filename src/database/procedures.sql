--Cerrar sesion
DELIMITER //
CREATE PROCEDURE CloseUserSession(IN persona_id CHAR(36))
BEGIN
    UPDATE credenciales
    SET
        Numero_De_Intentos = 0,
        Fin_De_Sesion = NOW(),
        Token_De_Sesion = NULL,
        Actualizado_EN = NOW()
    WHERE FK_Persona = persona_id;
END //
DELIMITER ;

--Validar Planes --> Carrera
DELIMITER //

CREATE PROCEDURE checkCareersPlans()
BEGIN
    DECLARE hasActivePlans BOOLEAN;

    SET hasActivePlans = careerHasActivePlans();

    IF hasActivePlans THEN
        SELECT TRUE AS Valid;
    ELSE
        SELECT 
            carrera.ID_Carrera, carrera.Nombre
        FROM carrera
        WHERE ID_Carrera NOT IN (
            SELECT FK_Carrera
            FROM carrera_plan_academico
            WHERE Active = 1
        );
    END IF;
END //

DELIMITER ;
