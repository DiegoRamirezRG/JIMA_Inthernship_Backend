const db = require('../../config/databaseConfig');
const SubjectModel = {};

SubjectModel.allSubjects = async () => {
    const connection = await db.getConnection();
    return new Promise(async(resolve, reject) => {
        try {
            
            const [result] = await connection.query('SELECT m.*, a.Nombre as Area_Nombre, a.Codigo_De_Area FROM materia as m, area as a WHERE m.FK_Area = a.ID_Area');
            connection.release();
            resolve(result);

        } catch (error) {
            connection.release();
            reject(error);
        }
    })
}

SubjectModel.createSubject = async (Nombre, Descripcion, Codigo_De_Materia, Creditos, Horas_De_Clase, FK_Area) => {
    const connection = await db.getConnection();
    return new Promise(async(resolve, reject) => {
        try {
            connection.beginTransaction();

            const [result] = await connection.query(`INSERT INTO materia (Nombre, Descripcion, Codigo_De_Materia, Creditos, Horas_De_Clase, FK_Area, Creado_En) VALUES ("${Nombre}", ${Descripcion != null ? `"${Descripcion}"` : null}, "${Codigo_De_Materia}", ${Creditos}, ${Horas_De_Clase}, "${FK_Area}", NOW())`);

            if(result.affectedRows > 0){
                connection.commit();
                connection.release();
                resolve();
            }
        } catch (error) {
            console.error(error);
            connection.rollback();
            connection.release();
            reject(error);
        }
    })
}

SubjectModel.getAreas = async () => {
    const connection = await db.getConnection();
    return new Promise(async(resolve, reject) => {
        try {
            
            const [result] = await connection.query('SELECT * FROM area');
            connection.release();
            resolve(result);

        } catch (error) {
            connection.release();
            reject(error);
        }
    })
}

SubjectModel.createArea = async (Nombre, Descripcion, Codigo_De_Area) => {
    const connection = await db.getConnection();
    return new Promise(async(resolve, reject) => {
        try {
            connection.beginTransaction();

            const [result] = await connection.query(`INSERT INTO area(Nombre, Descripcion, Codigo_De_Area) VALUES ("${Nombre}", ${Descripcion!= null ? `"${Descripcion}"` : null}, "${Codigo_De_Area}")`);

            if(result.affectedRows > 0){
                connection.commit();
                connection.release();
                resolve()
            }
        } catch (error) {
            connection.rollback();
            connection.release();
            reject(error);
        }
    })
}

SubjectModel.verifyArea = async (area_id) => {
    const connection = await db.getConnection();
    return new Promise(async(resolve, reject) => {
        try {
            const [result] = await connection.query(`SELECT * FROM area WHERE ID_Area = "${area_id}"`);

            if(result.length > 0){
                resolve('Exist');
            }else{
                reject(new Error('El area no existe'));
            }
        } catch (error) {
            connection.release();
            reject(error);
        }
    })
}

module.exports = SubjectModel;