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

SchoolInfoModel.createGradeIfNotExist = async (gradeNumber) => {
    const connection = await db.getConnection();
    return new Promise( async (resolve, reject) => {
        try {
            const newGradeId = await connection.query(`SELECT ObtenerIDGrado(${gradeNumber}) AS ID_Grado`);
            connection.release();
            if(newGradeId.length > 0){
                resolve(newGradeId[0].ObtenerIDGrado);
            }
        } catch (error) {
            connection.release();
            console.error(error);
            reject(error);
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
            const [result] = await connection.query('SELECT * FROM grupos ORDER BY Indicador ASC');
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

SchoolInfoModel.updateGroup = async (indicator, ID_Group) => {
    const connection = await db.getConnection();
    return new Promise(async (resolve, reject) => {
        try {
            connection.beginTransaction();

            const [result] = await connection.query(`UPDATE grupos SET Indicador = "${indicator}", Actualizado_EN = NOW() WHERE ID_Grupo = "${ID_Group}"`);

            if(result.affectedRows > 0){
                connection.commit();
                connection.release();
                resolve();
            }else{
                throw new Error('Ha ocurrido un error actualizando el grupo')
            }
        } catch (error) {
            connection.rollback();
            connection.release();
            console.error(error.message);
            reject(error);
        }
    })
}

module.exports = SchoolInfoModel;