const db = require('../../config/databaseConfig');
const TeacherModels = {};

TeacherModels.getActiveTeachers = async () => {
    const connection = await db.getConnection();
    return new Promise(async (resolve, reject) => {
        try {
            
            const [result] = await connection.query('SELECT per.Nombre, per.Apellido_Paterno, per.Apellido_Materno, pro.ID_Profesor FROM profesor AS pro JOIN persona AS per ON pro.FK_Persona = per.ID_Persona WHERE per.Active = TRUE');
            connection.release();
            resolve(result);

        } catch (error) {
            connection.release();
            console.error(error);
            reject(error);
        }
    })
}

TeacherModels.getAllTeachers = async () => {
    const connection = await db.getConnection();
    return new Promise(async (resolve, reject) => {
        try {
            
            const [result] = await connection.query('SELECT per.Nombre, per.Apellido_Paterno, per.Apellido_Materno, pro.ID_Profesor FROM profesor AS pro JOIN persona AS per ON pro.FK_Persona = per.ID_Persona');
            connection.release();
            resolve(result);

        } catch (error) {
            connection.release();
            console.error(error);
            reject(error);
        }
    })
}

TeacherModels.getClassesByTeacherId = async (teacherId) => {
    const connection = await db.getConnection();
    return new Promise(async (resolve, reject) => {
        try {
            const [result] = await connection.query(`SELECT c.* FROM clase as c JOIN profesor as p ON c.FK_Profesor = p.ID_Profesor JOIN persona as per ON per.ID_Persona = p.FK_Persona WHERE c.Active = TRUE AND per.ID_Persona = "${teacherId}"`);
            connection.release();
            resolve(result);
        } catch (error) {
            connection.release();
            console.error(error);
            reject(error);
        }
    })
}
module.exports = TeacherModels;