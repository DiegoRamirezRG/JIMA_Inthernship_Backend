--init calendar
DELIMITER //
CREATE TRIGGER handle_schoolar_cicle
AFTER INSERT ON calendario
FOR EACH ROW
BEGIN
    INSERT INTO handler_ciclo_escolar (FK_Calendario) VALUES (NEW.ID_Calendario);
END //
DELIMITER ;

--Añadir cobro de inscripcion / reinscripcion automatico
DELIMITER //
CREATE TRIGGER ins_payment
AFTER INSERT ON inscripciones
FOR EACH ROW
BEGIN
    DECLARE person_id CHAR(36);
    DECLARE reinc_id CHAR(36);
    DECLARE inscr_id CHAR(36);
    DECLARE estudiante_count INT;

    SELECT p.ID_Persona INTO person_id
    FROM estudiante e
    JOIN persona p ON p.ID_Persona = e.FK_Persona
    WHERE e.ID_Estudiante = NEW.FK_Estudiante;

    SELECT COUNT(*) INTO estudiante_count
    FROM inscripciones
    WHERE FK_Estudiante = NEW.FK_Estudiante;

    SELECT ID_Costo INTO reinc_id FROM costes WHERE Concepto = "REINS";
    SELECT ID_Costo INTO inscr_id FROM costes WHERE Concepto = "INSCR";

    IF estudiante_count > 1 THEN
        CALL insert_payment_person(person_id, reinc_id);
    ELSE
        CALL insert_payment_person(person_id, inscr_id); 
    END IF;
END //
DELIMITER ;

--Ahora actualiza a pagado la inscripcion
DELIMITER //
CREATE TRIGGER upd_payment
AFTER UPDATE ON persona_coste
FOR EACH ROW
BEGIN
    DECLARE coste_type VARCHAR(30);
    DECLARE estudiante_id CHAR(36);
    DECLARE last_insc_id CHAR(36);

    SELECT Concepto INTO coste_type
    FROM costes 
    WHERE  ID_Costo = NEW.FK_Coste;

    SELECT ID_Estudiante INTO estudiante_id
    FROM estudiante 
    WHERE FK_Persona = NEW.FK_Persona;


    IF NEW.Pagado = TRUE AND (coste_type = 'INSCR' OR coste_type = 'REINS') THEN
        SELECT ID_Inscripciones INTO last_insc_id 
        FROM inscripciones 
        WHERE FK_Estudiante = estudiante_id ORDER BY Creado_EN DESC LIMIT 1;

        UPDATE inscripciones
        SET Pagado = TRUE
        WHERE ID_Inscripciones = last_insc_id;
    END IF;
END //
DELIMITER ;