--init calendar
DELIMITER //
CREATE TRIGGER handle_schoolar_cicle
AFTER INSERT ON calendario
FOR EACH ROW
BEGIN
    INSERT INTO handler_ciclo_escolar (FK_Calendario) VALUES (NEW.ID_Calendario);
END //
DELIMITER ;