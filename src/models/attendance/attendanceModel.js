const db = require('../../config/databaseConfig');
const AttendanceModel = {};

AttendanceModel.getTodayAttendance = async (class_id) => {
    const connection = await db.getConnection();
    return new Promise(async (resolve, reject) => {
        try {
            const [result] = await connection.query('SELECT * FROM asistencia WHERE FK_Clase = ? AND DATE(Fecha) = CURDATE()',[
                class_id
            ]);

            connection.release();
            resolve(result);
        } catch (error) {
            connection.release();
            console.error(error);
            reject(error);
        }
    })
}

AttendanceModel.takeTodayAttendance = async (attedance) => {
    const connection = await db.getConnection();
    return new Promise(async(resolve, reject) => {
        try {
            connection.beginTransaction();

            for (let i = 0; i < attedance.length; i++) {
                const [exist] = await connection.query('SELECT * FROM asistencia WHERE FK_Clase = ? AND FK_Estudiante = ?', [
                    attedance[i].ID_Clase,
                    attedance[i].ID_Estudiante
                ]);

                if(exist.length > 0){
                    const [update] = await connection.query('UPDATE asistencia SET Estado = ? WHERE ID_Asistencia = ?', [
                        attedance[i].Estado,
                        exist[0].ID_Asistencia,
                    ]);

                    if(!(update.affectedRows > 0)){
                        throw new Error('Ha ocurrido un error insertando la asistencia');
                    }
                }else{
                    const [insert] = await connection.query('INSERT INTO asistencia(FK_Clase, FK_Estudiante, Estado) VALUES (?, ?, ?)', [
                        attedance[i].ID_Clase,
                        attedance[i].ID_Estudiante,
                        attedance[i].Estado,
                    ]);

                    if(!(insert.affectedRows > 0)){
                        throw new Error('Ha ocurrido un error insertando la asistencia');
                    }
                }
            }

            //TESTING
            const [testing] = await connection.query('SELECT * FROM asistencia');
            console.table(testing);
            //TESTING

            connection.commit();
            connection.release()
            resolve();
        } catch (error) {
            connection.rollback();
            connection.release();
            console.error(error);
            reject(error);
        }
    })
}

module.exports = AttendanceModel;