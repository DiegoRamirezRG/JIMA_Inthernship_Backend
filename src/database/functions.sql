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

--Validar / Crear Grado
DELIMITER //
CREATE FUNCTION ObtenerIDGrado(p_Numero INT) RETURNS CHAR(36) DETERMINISTIC
BEGIN
    DECLARE grado_id CHAR(36);

    SELECT ID_Grado INTO grado_id
    FROM grados
    WHERE Numero = p_Numero;

    IF grado_id IS NULL THEN
        INSERT INTO grados (Numero)
        VALUES (p_Numero);

        SELECT ID_Grado INTO grado_id
        FROM grados
        WHERE Numero = p_Numero;
    END IF;

    RETURN grado_id;
END //
DELIMITER ;

--Crear Grupos
DELIMITER //
CREATE FUNCTION CrearGrupoAutomatico(g_numero INT) RETURNS CHAR(36) DETERMINISTIC
BEGIN
    DECLARE grupo_id CHAR(36);
    DECLARE searchedInd VARCHAR(10);

    SET searchedInd = CONCAT(YEAR(NOW()), '-', g_numero);

    SELECT ID_Grupo INTO grupo_id
    FROM grupos
    WHERE Indicador = searchedInd;

    IF grupo_id IS NULL THEN
        INSERT INTO grupos(Indicador)
        VALUES (searchedInd);

        SELECT ID_Grupo INTO grupo_id
        FROM grupos
        WHERE Indicador = searchedInd;
    END IF;

    RETURN grupo_id;
END //
DELIMITER ;
