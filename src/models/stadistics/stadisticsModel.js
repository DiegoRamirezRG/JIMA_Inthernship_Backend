const db = require('../../config/databaseConfig');
const StadisticsModel = {};

StadisticsModel.getTotalUsers = async() => {
    const connection = await db.getConnection();
    return new Promise(async (resolve, reject) => {
        try {
            const [result] = await connection.query('SELECT COUNT(*) as totalUsers FROM persona');
            connection.release();
            resolve(result[0].totalUsers);
        } catch (error) {
            connection.release();
            console.error(error);
            reject(error);
        }
    });
}

StadisticsModel.getTotalStudentToBe = async() => {
    const connection = await db.getConnection();
    return new Promise(async (resolve, reject) => {
        try {
            const [result] = await connection.query('SELECT COUNT(*) as totalStudenToBe FROM estudiante E LEFT JOIN aspirante_helper A ON E.ID_Estudiante = A.FK_Estudiante WHERE A.ID_Aspirante IS NOT NULL;');
            connection.release();
            resolve(result[0].totalStudenToBe);
        } catch (error) {
            connection.release();
            console.error(error);
            reject(error);
        }
    });
}

StadisticsModel.getTotalStudents = async() => {
    const connection = await db.getConnection();
    return new Promise(async (resolve, reject) => {
        try {
            const [result] = await connection.query('SELECT COUNT(*) as totalStudents FROM estudiante E LEFT JOIN aspirante_helper A ON E.ID_Estudiante = A.FK_Estudiante WHERE A.ID_Aspirante IS NULL;');
            connection.release();
            resolve(result[0].totalStudents);
        } catch (error) {
            connection.release();
            console.error(error);
            reject(error);
        }
    });
}


StadisticsModel.getTotalTeachers = async () => {
    const connection = await db.getConnection();
    return new Promise(async(resolve, reject) => {
        try {
            const [result] =  await connection.query('SELECT COUNT(*) as totalTeachers FROM persona WHERE Rol = "Profesor"');
            connection.release();
            resolve(result[0].totalTeachers);
        } catch (error) {
            connection.release();
            console.error(error);
            reject(error);
        }
    });
}

StadisticsModel.getTotalAdmins = async () => {
    const connection = await db.getConnection();
    return new Promise(async(resolve, reject) => {
        try {
            const [result] =  await connection.query('SELECT COUNT(*) as totalAdmins FROM persona WHERE Rol = "Administrativo"');
            connection.release();
            resolve(result[0].totalAdmins);
        } catch (error) {
            connection.release();
            console.error(error);
            reject(error);
        }
    });
}

StadisticsModel.getGenderStats = async () => {
    const connection = await db.getConnection();
    return new Promise(async(resolve, reject) => {
        try {
            const [resultMasc] =  await connection.query("SELECT COUNT(*) as 'Masculino' FROM persona WHERE Genero = 'Masculino'");
            const [resultFem] =  await connection.query("SELECT COUNT(*) as 'Femenino' FROM persona WHERE Genero = 'Femenino'");
            const [resultOther] =  await connection.query("SELECT COUNT(*) as 'Otro' FROM persona WHERE Genero = 'Otro'");
            connection.release();

            let genderStats =[
                {gender: 'Masculino', value: resultMasc[0].Masculino, color: '#1FC0C8'},
                {gender: 'Femenino', value: resultFem[0].Femenino, color: '#F55C7A'},
                {gender: 'Otro', value: resultOther[0].Otro, color: '#6941C6'}
            ]

            resolve(genderStats);
        } catch (error) {
            connection.release();
            console.error(error);
            reject(error);
        }
    });
}

StadisticsModel.getStudentCicleStats = async () => {
    const connection = await db.getConnection();
    return new Promise(async (resolve, reject) => {
        try {
            const [result] = await connection.query(`WITH RankedInscripciones AS (
                SELECT
                    i.*,
                ROW_NUMBER() OVER (PARTITION BY i.FK_Estudiante ORDER BY i.Creado_En DESC) AS rn
                FROM
                    inscripciones i
            )
            SELECT e.ID_Estudiante, p.ID_Persona, gra.Numero, gru.Indicador, tur.Nombre as Turno, car.Nombre as Carrera FROM estudiante e
            JOIN persona as p ON e.FK_Persona = p.ID_Persona
            JOIN RankedInscripciones ins ON e.ID_Estudiante = ins.FK_Estudiante AND ins.rn = 1
            JOIN grados gra ON gra.ID_Grado = ins.FK_Grado
            JOIN grupos gru ON gru.ID_Grupo = ins.FK_Grupo
            JOIN turnos tur ON tur.ID_Turno = ins.FK_Turno
            JOIN carrera car ON car.ID_Carrera = ins.FK_Carrera
            WHERE p.Active = TRUE
            AND e.Titulado = FALSE
            AND ins.Active = TRUE`);

            connection.release();
            resolve(result);
        } catch (error) {
            connection.release();
            console.error(error);
            reject(error);
        }
    })
}

module.exports = StadisticsModel;