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

--Get Kardex Part 1
DELIMITER //

CREATE PROCEDURE getKardex(IN p_id_persona CHAR(36))
BEGIN
    WITH CTE AS (
    SELECT
        c.ID_Clase,
        c.FK_Materia,
        c.FK_Profesor,
        c.Creado_En AS Fecha_Creacion_Clase,
        cal.Nombre AS Nombre_Calendario,
        ROW_NUMBER() OVER (PARTITION BY c.ID_Clase ORDER BY ABS(DATEDIFF(c.Creado_En, cal.Inicio))) AS rn
    FROM
        clase c
    JOIN
        calendario cal ON cal.Inicio <= c.Creado_En
    ORDER BY
        c.Creado_En - cal.Inicio ASC
    )
    SELECT 
        c.ID_Clase,
        c.Active as Clase_En_Curso,
        m.Codigo_De_Materia,
        m.Nombre as Nombre_Materia,
        m.Creditos,
        ROUND(AVG(CASE WHEN a.Estado = 'Falta' THEN 0 ELSE 1 END), 2) * 100 AS Prom_Asis,
        CTE.Nombre_Calendario
    FROM 
        clase AS c
    JOIN 
        materia AS m ON c.FK_Materia = m.ID_Materia
    JOIN 
        estudiante_clases AS ec ON ec.FK_Clase = c.ID_Clase
    JOIN 
        estudiante AS e ON e.ID_Estudiante = ec.FK_Estudiante
    JOIN 
        persona AS p ON p.ID_Persona = e.FK_Persona
    LEFT JOIN 
        asistencia AS a ON a.FK_Clase = c.ID_Clase AND a.FK_Estudiante = e.ID_Estudiante
    LEFT JOIN 
        CTE ON CTE.ID_Clase = c.ID_Clase AND CTE.rn = 1
    WHERE 
        p.ID_Persona = p_id_persona
    GROUP BY 
        ID_Clase,
        CTE.Nombre_Calendario,
        Codigo_De_Materia,
        Creditos
    ORDER BY
        c.Creado_En;

END //

DELIMITER ;

--Get Kardex Part 2
DELIMITER //

CREATE PROCEDURE getGradesAvg(IN p_id_clase CHAR(36), IN p_id_estudiante CHAR(36))
BEGIN
    DECLARE actividades_count INT;
    DECLARE entregas_count INT;
    DECLARE helper_count INT DEFAULT 0;
    DECLARE resting_assigns FLOAT DEFAULT 0;

    SELECT COUNT(*) INTO actividades_count
    FROM actividad as a
    WHERE a.FK_Clase = p_id_clase;

    SELECT COUNT(*) INTO entregas_count
    FROM entregas AS ec
    WHERE ec.FK_Estudiante = p_id_estudiante;

    IF actividades_count = entregas_count THEN
        SELECT COALESCE(AVG(en.Calificacion), 100) AS promedio 
        FROM entregas AS en
        JOIN actividad as act ON act.ID_Actividad = en.FK_Actividad
        WHERE FK_Estudiante = p_id_estudiante
        AND act.FK_Clase = p_id_clase;
    ELSE
        SELECT SUM(en.Calificacion) INTO helper_count
        FROM entregas AS en
        JOIN actividad as act ON act.ID_Actividad = en.FK_Actividad
        WHERE FK_Estudiante = p_id_estudiante
        AND act.FK_Clase = p_id_clase;

        SET resting_assigns = ROUND(helper_count / actividades_count, 2);
        SELECT resting_assigns;
    END IF;

END //

DELIMITER ;

-- Obtener Boleta
DELIMITER //

CREATE PROCEDURE getStudentActiveClasses(IN p_id_estudiante CHAR(36))
BEGIN
    SELECT
        m.Codigo_De_Materia,
        m.Nombre AS Nombre_Materia,
        m.Creditos,
        c.ID_Clase
    FROM materia m
    JOIN clase c ON c.FK_Materia = m.ID_Materia
    JOIN estudiante_clases ec ON ec.FK_Clase = c.ID_Clase
    WHERE ec.FK_Estudiante = p_id_estudiante
    AND c.Active = TRUE;
END //

DELIMITER ;

--Obtener todas las clases
DELIMITER //

CREATE PROCEDURE getStudentAllClasses(IN p_id_estudiante CHAR(36))
BEGIN
    SELECT
        m.Codigo_De_Materia,
        m.Nombre AS Nombre_Materia,
        m.Creditos,
        c.ID_Clase
    FROM materia m
    JOIN clase c ON c.FK_Materia = m.ID_Materia
    JOIN estudiante_clases ec ON ec.FK_Clase = c.ID_Clase
    WHERE ec.FK_Estudiante = p_id_estudiante;
END //

DELIMITER ;

-- Obtener Unidades
DELIMITER //

CREATE PROCEDURE get_class_units(IN p_id_class CHAR(36))
BEGIN
    SELECT ID_Unidad 
    FROM unidad 
    WHERE FK_Clase = p_id_class
    ORDER BY Creado_EN DESC;
END //

DELIMITER ;

--Obtener Avg por unidad
DELIMITER //

CREATE PROCEDURE get_unit_avg(IN p_id_class CHAR(36), IN p_id_unit CHAR(36), IN p_id_estudent CHAR(36))
BEGIN

    DECLARE activities_count INT DEFAULT 0;
    DECLARE turnedin_count INT DEFAULT 0;
    DECLARE sum_helper INT DEFAULT 0;

    SELECT 
        COUNT(a.ID_Actividad), COUNT(e.ID_Entregas) 
    INTO activities_count, turnedin_count
    FROM actividad a
    LEFT JOIN entregas e ON a.ID_Actividad = e.FK_Actividad AND e.FK_Estudiante = p_id_estudent
    WHERE a.FK_Unidad = p_id_unit
    AND a.FK_Clase = p_id_class;

    IF activities_count = turnedin_count THEN
        SELECT 
        FORMAT(AVG(e.Calificacion), 2) as grade
        FROM actividad a
        LEFT JOIN entregas e ON a.ID_Actividad = e.FK_Actividad AND e.FK_Estudiante = p_id_estudent
        WHERE a.FK_Unidad = p_id_unit
        AND a.FK_Clase = p_id_class;
    ELSE
        SELECT 
        SUM(e.Calificacion) INTO sum_helper
        FROM actividad a
        LEFT JOIN entregas e ON a.ID_Actividad = e.FK_Actividad AND e.FK_Estudiante = p_id_estudent
        WHERE a.FK_Unidad = p_id_unit
        AND a.FK_Clase = p_id_class;

        SELECT FORMAT(sum_helper / activities_count, 2) as grade;
    END IF;

END //

DELIMITER ;

--Obtener Avg por unidad en extra no unit
DELIMITER //

CREATE PROCEDURE get_unit_avg_no_unit(IN p_id_class CHAR(36), IN p_id_estudent CHAR(36))
BEGIN

    DECLARE activities_count INT DEFAULT 0;
    DECLARE turnedin_count INT DEFAULT 0;
    DECLARE sum_helper INT DEFAULT 0;

    SELECT 
        COUNT(a.ID_Actividad), COUNT(e.ID_Entregas) 
    INTO activities_count, turnedin_count
    FROM actividad a
    LEFT JOIN entregas e ON a.ID_Actividad = e.FK_Actividad AND e.FK_Estudiante = p_id_estudent
    WHERE a.FK_Clase = p_id_class
    AND a.Fk_Unidad IS NULL;

    IF turnedin_count > 0 and turnedin_count IS NOT NULL AND activities_count > 0 AND activities_count = turnedin_count THEN
        SELECT 
        FORMAT(AVG(e.Calificacion), 2) as extra_grade
        FROM actividad a
        LEFT JOIN entregas e ON a.ID_Actividad = e.FK_Actividad AND e.FK_Estudiante = p_id_estudent
        WHERE a.FK_Clase = p_id_class
        AND a.Fk_Unidad IS NULL;
    ELSE
        SELECT 
        SUM(e.Calificacion) INTO sum_helper
        FROM actividad a
        LEFT JOIN entregas e ON a.ID_Actividad = e.FK_Actividad AND e.FK_Estudiante = p_id_estudent
        WHERE a.FK_Clase = p_id_class
        AND a.Fk_Unidad IS NULL;

        IF sum_helper > 0 AND sum_helper IS NOT NULL THEN
            SELECT FORMAT(sum_helper / activities_count, 2) as extra_grade;
        ELSE
            SELECT '- - - -' AS extra_grade;
        END IF;

    END IF;

END //

DELIMITER ;

--Insert basic payments
DELIMITER //

CREATE PROCEDURE create_basic_payments()
BEGIN

    INSERT INTO costes(Concepto, Descripcion, Coste, Vigencia) 
    VALUES ("INSCR", "Inscripcion", 2500, 3), ("REINS", "Reinscripcion", 2500, 3);

END //

DELIMITER ;

-- Inser and Update Folio
DELIMITER //

CREATE PROCEDURE insert_payment_person(IN person_id CHAR(36), IN payment_id CHAR(36))
BEGIN
    DECLARE maxFolioNumber INT DEFAULT 0;
    SELECT MAX(Folio) INTO maxFolioNumber FROM persona_coste;

    INSERT INTO persona_coste(FK_Persona, FK_Coste, Folio) VALUES(person_id, payment_id, maxFolioNumber + 1);
END //

DELIMITER ;

--Inser the custom enrolled student
DELIMITER //

CREATE PROCEDURE insert_custom_enrolled_classes(IN student_id CHAR(36), IN carrera_id CHAR(36), IN grado_id CHAR(36), IN grupo_id CHAR(36), IN turno_id CHAR(36))
BEGIN
    DECLARE ClaseID CHAR(36);
    DECLARE done INT DEFAULT 0;

    DECLARE current_classes CURSOR FOR
    SELECT DISTINCT(ec.FK_Clase) FROM estudiante_clases ec
    JOIN clase c ON c.ID_Clase = ec.FK_Clase
    JOIN estudiante e ON ec.FK_Estudiante = e.ID_Estudiante
    JOIN inscripciones i ON i.FK_Estudiante = e.ID_Estudiante
    WHERE
    i.FK_Carrera = carrera_id AND
    i.FK_Grado = grado_id AND
    i.FK_Grupo = grupo_id AND
    i.FK_Turno = turno_id AND
    c.Active = TRUE;

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;
    OPEN current_classes;

    FETCH current_classes INTO ClaseID;

    register_classes_loop: WHILE NOT done DO
        INSERT INTO estudiante_clases(FK_Estudiante, FK_Clase) VALUES (student_id, ClaseID);
        FETCH current_classes INTO ClaseID;
    END WHILE register_classes_loop;

    CLOSE current_classes;
END//

DELIMITER ;

--Finish the school cicle
DELIMITER //

CREATE PROCEDURE finish_schoolar_cicle()
BEGIN
    UPDATE inscripciones SET Active = FALSE, Actualizado_EN = NOW();
    UPDATE clase SET Active = FALSE, Actualizado_EN = NOW();
    UPDATE calendario SET Active = FALSE, Actualizado_EN = NOW();
END //

DELIMITER ;

--GetThe Inscription Date
DELIMITER //

CREATE PROCEDURE getInscriptionDates(IN student_ids_json JSON)
BEGIN
    CREATE TEMPORARY TABLE IF NOT EXISTS TempTable (student_id CHAR(36));

    INSERT INTO TempTable (student_id)
    SELECT value
    FROM JSON_TABLE(student_ids_json, '$[*]' COLUMNS (value CHAR(36) PATH '$')) AS table_json;

    SELECT DISTINCT(DATE_FORMAT(i.Creado_En, '%Y/%m/%d')) as inscription_date
    FROM inscripciones i
    WHERE i.FK_Estudiante IN (SELECT student_id FROM TempTable)
    ORDER BY inscription_date ASC
    LIMIT 1;

    DROP TEMPORARY TABLE IF EXISTS TempTable;
END //

DELIMITER ;


--Get Subjects by plan active and cycle
DELIMITER //

CREATE PROCEDURE getSubjectForReinscript(IN career_id CHAR(36), IN before_date VARCHAR(15), IN cycle_needed INT)
BEGIN

    WITH active_plan AS (
        SELECT ID_Carrera_Plan_Academico FROM carrera_plan_academico 
        WHERE FK_Carrera = career_id
        AND Creado_En <= before_date ORDER BY Creado_En ASC
        LIMIT 1
    )
    SELECT m.*, (SELECT ma.Nombre FROM materia ma WHERE ID_Materia = dpa.Materia_Previa) AS Materia_Previa FROM detalle_plan_academico AS dpa
    JOIN active_plan ap ON ap.ID_Carrera_Plan_Academico = dpa.FK_Carrera_Plan_Academico
    JOIN materia AS m ON dpa.FK_Materia = m.ID_Materia
    AND dpa.Ciclo_A_Impartir = cycle_needed;

END //

DELIMITER ;

--Create grade if not exist
DELIMITER //

CREATE PROCEDURE getGradeId(IN grade_number INT)
BEGIN

    DECLARE grade_id CHAR(36);

    SELECT ID_Grado INTO grade_id
    FROM grados
    WHERE Numero = grade_number;

    IF grade_id IS NULL THEN
        INSERT INTO grados (Numero) VALUES (grade_number);
        
        SELECT ID_Grado
        FROM grados
        WHERE Numero = grade_number;
    END IF;

    SELECT ID_Grado
    FROM grados
    WHERE Numero = grade_number;
END //

DELIMITER ;
