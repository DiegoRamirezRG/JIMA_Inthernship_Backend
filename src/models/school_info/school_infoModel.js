const db = require('../../config/databaseConfig');
const SchoolInfoModel = {}

SchoolInfoModel.validateShiftID = async (ID_Turno) => {
    const connection = await db.getConnection();
    return new Promise(async (resolve, reject) => {
        try {
            
            const [result] = await connection.query(`SELECT * FROM turnos WHERE ID_Turno = "${ID_Turno}"`);

            if(result.length > 0){
                resolve();
            }else{
                reject(new Error('El id mandado no es un de un turno'));
            }

        } catch (error) {
            connection.release();
            console.error(error.message);
            reject(error);
        }
    })
}

SchoolInfoModel.getShifts = async () => {
    const connection = await db.getConnection();
    return new Promise(async (resolve, reject) => {
        try {            
            const [result] = await connection.query('SELECT * FROM turnos ORDER BY Hora_Inicio, Hora_Fin');
            connection.release();

            resolve(result);
        } catch (error) {
            connection.release();
            console.error(error.message);
            reject(error);
        }
    })
}

SchoolInfoModel.createShift = async (name, init, end) => {
    const connection = await db.getConnection();
    return new Promise(async (resolve, reject) => {
        try {
            connection.beginTransaction();
            const [result] = await connection.query(`INSERT INTO turnos(Nombre, Hora_Inicio, Hora_Fin) VALUES("${name}", "${init}", "${end}")`);
            
            if(result.affectedRows > 0){
                connection.commit();
                connection.release();
                resolve();
            }else{
                throw new Error('Ha ocurrido un error insertando el turno')
            }
        } catch (error) {
            connection.rollback();
            connection.release();
            console.error(error.message);
            reject(error)
        }
    })
}

SchoolInfoModel.updateShift = async (ID_Turno, Nombre, Hora_Inicio, Hora_Fin) => {
    const connection = await db.getConnection();
    return new Promise(async(resolve, reject) => {
        try {
            connection.beginTransaction();

            const [result] = await connection.query(`UPDATE turnos SET Nombre = "${Nombre}", Hora_Inicio = "${Hora_Inicio}", Hora_Fin = "${Hora_Fin}", Actualizado_EN = NOW() WHERE ID_Turno = "${ID_Turno}"`);

            if(result.affectedRows > 0){
                connection.commit();
                connection.release();
                resolve();
            }else{
                throw new Error('Error al actualizar el turno');
            }

        } catch (error) {
            connection.rollback();
            connection.release();
            console.error(error.message);
            reject(error);
        }
    })
}

SchoolInfoModel.getGrades = async () => {
    const connection = await db.getConnection();
    return new Promise(async (resolve, reject) => {
        try {            
            const [result] = await connection.query('SELECT * FROM grados ORDER BY Numero ASC');
            connection.release();

            resolve(result);
        } catch (error) {
            connection.release();
            console.error(error.message);
            reject(error)
        }
    })
}


SchoolInfoModel.createGrade = async (name, desc) => {
    const connection = await db.getConnection();
    return new Promise(async (resolve, reject) => {
        try {
            connection.beginTransaction();

            const [result] = await connection.query(`INSERT INTO grados(Numero${desc != "" && desc != null ? ', Descripcion' : ''}) VALUES (${name}${desc != "" && desc != null ? `, "${desc}"` : ''})`);

            if(result.affectedRows > 0){
                connection.commit();
                connection.release();
                resolve();
            }else{
                throw new Error('Ha ocurrido un error insertando el grado')
            }
        } catch (error) {
            connection.rollback();
            connection.release();
            console.error(error.message);
            reject(error)
        }
    })
}

SchoolInfoModel.updateGrade = async (Numero, desc, grade_id) => {
    const connection = await db.getConnection();
    return new Promise(async (resolve, reject) => {
        try {
            
            connection.beginTransaction();
            const [result] = await connection.query(`UPDATE grados SET Numero = ${Numero}${desc != "" && desc != null ? `, Descripcion = "${desc}"` : ''}, Actualizado_EN = NOW() WHERE ID_Grado = "${grade_id}"`);

            if(result.affectedRows > 0){
                connection.commit();
                connection.release();
                resolve();
            }else{
                throw new Error('Error al actualizar el grado')
            }
        } catch (error) {
            connection.rollback();
            connection.release();
            console.error(error.message);
            reject(error);
        }
    })
}

SchoolInfoModel.getGroups = async () => {
    const connection = await db.getConnection();
    return new Promise(async (resolve, reject) => {
        try {            
            const [result] = await connection.query('SELECT * FROM grupos');
            connection.release();

            resolve(result);
        } catch (error) {
            connection.release();
            console.error(error.message);
            reject(error)
        }
    })
}

SchoolInfoModel.createGroup = async (indicador) => {
    const connection = await db.getConnection();
    return new Promise(async (resolve, reject) => {
        try {
            connection.beginTransaction();

            const [result] = await connection.query(`INSERT INTO grupos(Indicador) VALUES ("${indicador}")`);

            if(result.affectedRows > 0){
                connection.commit();
                connection.release();
                resolve();
            }else{
                throw new Error('Ha ocurrido un error insertando el grupo')
            }
        } catch (error) {
            connection.rollback();
            connection.release();
            console.error(error.message);
            reject(error)
        }
    })
}

module.exports = SchoolInfoModel;