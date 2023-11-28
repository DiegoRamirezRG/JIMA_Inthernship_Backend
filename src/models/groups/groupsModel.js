const db = require('../../config/databaseConfig');
const GroupsModel = {};

GroupsModel.getClassData = async (class_id) => {
    const connection = await db.getConnection();
    return new Promise(async(resolve, reject) => {
        try {
            const [result] = await connection.query(`SELECT * FROM clase WHERE Active = TRUE AND ID_Clase = "${class_id}"`);
            connection.release();
            resolve(result[0]);
        } catch (error) {
            connection.release();
            console.log(error);
            reject(error);
        }
    })
};

GroupsModel.getScheduleByClassId = async (class_id) => {
    const connection = await db.getConnection();
    return new Promise(async(resolve, reject) => {
        try {
            const [result] = await connection.query(`SELECT ID_Horario, Dia, Hora_Inicio, Hora_Fin FROM horario WHERE FK_Clase = "${class_id}" ORDER BY Dia`);
            connection.release();
            resolve(result);
        } catch (error) {
            connection.release();
            console.log(error);
            reject(error);
        }
    })
}

GroupsModel.getAssistanceList = async(class_id) => {
    const connection = await db.getConnection();
    return new Promise(async(resolve, reject) => {
        try {
            const [result] = await connection.query(`SELECT ec.ID_Estudiante_Clases, e.ID_Estudiante, e.Matricula, p.* FROM estudiante_clases as ec JOIN estudiante as e ON e.ID_Estudiante = ec.FK_Estudiante JOIN persona as p ON p.ID_Persona = e.FK_Persona WHERE ec.FK_Clase = "${class_id}"`);
            connection.release();
            resolve(result);
        } catch (error) {
            connection.release();
            console.log(error);
            reject(error);
        }
    })
}

module.exports = GroupsModel;