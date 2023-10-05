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