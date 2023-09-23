const db = require('../../config/databaseConfig');
const CareerModel = {};

CareerModel.getAllCareers = async() => {
    const connection = await db.getConnection();
    return new Promise(async(resolve, reject) => {
        try {
            const [result] = await connection.query('SELECT * FROM carrera');
            connection.release();

            resolve(result);
        } catch (error) {
            connection.release();
            console.error(error);
            reject(error);
        }
    })
}

CareerModel.getAllCareersActive = async() => {
    const connection = await db.getConnection();
    return new Promise(async(resolve, reject) => {
        try {
            const [result] = await connection.query('SELECT * FROM carrera WHERE Active = true');
            connection.release();

            resolve(result);
        } catch (error) {
            connection.release();
            console.error(error);
            reject(error);
        }
    })
}

CareerModel.createCareer = async( Nombre, Numero_De_Ciclos, Duracion_Mensual_De_Ciclos, Descripcion ) => {
    const connection = await db.getConnection();
    return new Promise(async(resolve, reject) => {
        try {
            const [result] = await connection.query(`INSERT INTO carrera(Nombre, Numero_De_Ciclos, Duracion_Mensual_De_Ciclos${Descripcion != null  && Descripcion.length > 0 && Descripcion != "" ? ', Descripcion' : ''}) VALUES ("${Nombre}", ${Numero_De_Ciclos}, ${Duracion_Mensual_De_Ciclos}${Descripcion != null && Descripcion.length > 0 && Descripcion != "" ? `, ${Descripcion}` : ''})`);
            connection.release();

            if (result && result.affectedRows > 0) {
                resolve('Success');
            } else {
                throw new Error('Ocurrio un error creando la carrera');
            }
        } catch (error) {
            connection.release();
            console.error(error);
            reject(error);
        }
    })
}

CareerModel.updateCareer = async (ID_Carrera, Nombre, Numero_De_Ciclos, Duracion_Mensual_De_Ciclos, Descripcion, Active) => {
    const connection = await db.getConnection();
    return new Promise(async (resolve, reject) => {
        try {
            connection.beginTransaction();
            const [update] = await connection.query(`UPDATE carrera SET Nombre = "${Nombre}", Numero_De_Ciclos = ${Numero_De_Ciclos}, Duracion_Mensual_De_Ciclos = ${Duracion_Mensual_De_Ciclos}, Descripcion = ${Descripcion != undefined && Descripcion != '' && Descripcion != null ? `"${Descripcion}"` : null}${Active && typeof Active == 'boolean' && Active != null && Active != undefined ? `, Active = ${Active}` : ''}, Actualizado_EN = NOW() WHERE ID_Carrera = "${ID_Carrera}"`);
            
            if(update.affectedRows > 0){
                connection.commit();
                connection.release();
                resolve();
            }else{
                throw new Error('Ocurrio un error actualizando al carrera');
            }
        } catch (error) {
            connection.rollback();
            connection.release();
            console.error(error);
            reject(error);
        }
    })
}


module.exports = CareerModel;