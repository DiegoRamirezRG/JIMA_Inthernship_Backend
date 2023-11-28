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

-- Desactivar todos los anteriores al hacer el nuevo
DELIMITER //
CREATE PROCEDURE setOnlyOnePlanActive(IN id_carrera_param CHAR(36), IN id_carrera_plan_param CHAR(36))
BEGIN
    UPDATE carrera_plan_academico
    SET Active = 0
    WHERE FK_Carrera = id_carrera_param
        AND ID_Carrera_Plan_Academico != id_carrera_plan_param;
END;
//
DELIMITER ;

-- Obtener Grupos para cargar subjects
DELIMITER //

CREATE PROCEDURE ObtenerDatosPorCiclo (IN NumeroCiclo INT)
BEGIN
    SELECT DISTINCT
        c.ID_Carrera,
        c.Nombre as Carrera,
        gra.ID_Grado,
        gra.Numero,
        gru.ID_Grupo,
        gru.Indicador,
        tur.ID_Turno,
        tur.Nombre as Turno,
        tur.Hora_Inicio,
        tur.Hora_Fin
    FROM
        inscripciones as i
    JOIN carrera as c ON i.FK_Carrera = c.ID_Carrera
    JOIN grados as gra ON i.FK_Grado = gra.ID_Grado
    JOIN grupos as gru ON i.FK_Grupo = gru.ID_Grupo
    JOIN turnos as tur ON i.FK_Turno = tur.ID_Turno
    JOIN carrera_plan_academico as cpa ON i.FK_Carrera = cpa.FK_Carrera
    JOIN detalle_plan_academico as dpa ON cpa.ID_Carrera_Plan_Academico = dpa.FK_Carrera_Plan_Academico
    LEFT JOIN estudiante_clases as ec ON i.FK_Carrera = ec.FK_Estudiante
    WHERE
        ec.ID_Estudiante_Clases IS NULL
        AND dpa.Ciclo_A_Impartir = NumeroCiclo;
END;
//

DELIMITER ;

--Obtener Materias
DELIMITER //

CREATE PROCEDURE obtener_materias_por_carrera_ciclo( IN p_fk_carrera CHAR(36), IN p_ciclo_a_impartir INT )
BEGIN
    SELECT
        m.ID_Materia
    FROM
        carrera_plan_academico AS cpa
    JOIN
        detalle_plan_academico AS dpa ON cpa.ID_Carrera_Plan_Academico = dpa.FK_Carrera_Plan_Academico
    JOIN
        materia AS m ON dpa.FK_Materia = m.ID_Materia
    WHERE
        cpa.Active = TRUE
        AND cpa.FK_Carrera = p_fk_carrera
        AND dpa.Ciclo_A_Impartir = p_ciclo_a_impartir;
END //

DELIMITER ;

--Obtener el estatus 
DELIMITER //

CREATE PROCEDURE obtenerEstadoTareaEstudiante(IN p_fk_actividad CHAR(36), IN p_id_persona CHAR(36))
BEGIN
    DECLARE cantidad_registros INT;
    
    SELECT COUNT(*) INTO cantidad_registros
    FROM entregas AS e
    JOIN estudiante as es ON es.ID_Estudiante = e.FK_Estudiante
    JOIN persona as p ON p.ID_Persona = es.FK_Persona
    WHERE e.FK_Actividad = p_fk_actividad AND p.ID_Persona = p_id_persona;

    IF cantidad_registros > 0 THEN
        SELECT e.*
        FROM entregas AS e
        JOIN estudiante as es ON es.ID_Estudiante = e.FK_Estudiante
        JOIN persona as p ON p.ID_Persona = es.FK_Persona
        WHERE e.FK_Actividad = p_fk_actividad AND p.ID_Persona = p_id_persona;
    ELSE
        SELECT CAST(0 AS UNSIGNED) AS ExisteRegistro;
    END IF;
END //

DELIMITER ;

