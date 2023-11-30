const db = require('../../config/databaseConfig');
const GradesModel = {};


GradesModel.getStudentTurnedIn = async (assign_id) => {
    const connection = await db.getConnection();
    return new Promise(async (resolve, reject) => {
        try {
            
            const [result] = await connection.query(`SELECT en.*, CONCAT(p.Nombre, ' ', p.Apellido_Paterno, ' ', p.Apellido_Materno) AS Nombre_Completo, p.ID_Persona, p.Imagen FROM entregas AS en
            JOIN estudiante AS e ON e.ID_Estudiante = en.FK_Estudiante
            JOIN persona AS p ON p.ID_Persona = e.FK_Persona
            WHERE FK_Actividad = "${assign_id}"`);

            connection.release();
            resolve(result);

        } catch (error) {
            connection.release();
            console.error(error);
            reject(error);
        }
    })
}

GradesModel.updateTurnedGrades = async (turneds) => {
    const connection = await db.getConnection();
    return new Promise(async (resolve, reject) => {
        try {
            connection.beginTransaction();

            for (let i = 0; i < turneds.length; i++) {
                const [updated] = await connection.query(`UPDATE entregas SET Calificacion = ${turneds[i].Calificacion}, Actualizado_EN = NOW() WHERE ID_Entregas = "${turneds[i].ID_Entrega}" AND FK_Estudiante = "${turneds[i].FK_Estudiante}"`);
                if(!(updated.affectedRows > 0)){
                    throw new Error('Ha ocurrido un error al acutalizar la calificacion en la entrega del estudiante');
                }
            }

            connection.commit();
            connection.release();
            resolve();
        } catch (error) {
            connection.rollback();
            connection.release();
            console.error(error);
            reject(error);
        }
    })
}

module.exports = GradesModel;