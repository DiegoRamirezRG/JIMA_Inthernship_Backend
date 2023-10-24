--Carreras tienen plan activo
DELIMITER //

CREATE FUNCTION careerHasActivePlans() RETURNS BOOLEAN DETERMINISTIC
BEGIN
    DECLARE hasActivePlans BOOLEAN;

    SELECT CASE WHEN COUNT(*) > 0 THEN FALSE ELSE TRUE END
    INTO hasActivePlans
    FROM carrera
    WHERE ID_Carrera NOT IN (
        SELECT FK_Carrera
        FROM carrera_plan_academico
        WHERE Active = 1
    );

    RETURN hasActivePlans;
END //

DELIMITER ;
