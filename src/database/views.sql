--Calendario existente y activo
CREATE VIEW existActiveCalendar AS
SELECT
    CASE
        WHEN EXISTS (
            SELECT 1
            FROM calendario
            WHERE Active = true AND CURDATE() BETWEEN Inicio AND Fin
        ) THEN (SELECT ID_Calendario FROM calendario WHERE Active = true AND CURDATE() BETWEEN Inicio AND Fin)
        ELSE false
    END AS isExistingActiveCalendar;