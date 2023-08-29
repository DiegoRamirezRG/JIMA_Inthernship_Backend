const db = require('../../config/databaseConfig');
const AlergiesModel = {};

AlergiesModel.getAlergiesByUserId = async (userId) => {

    const connection = await db.getConnection();
    return new Promise(async(resolve, reject) => {
        try {
            
            const [alergies] = await connection.query(`SELECT ID_Alergia, Nombre, Descripcion FROM alergias WHERE FK_Persona = "${userId}"`);
            resolve(alergies);

        } catch (error) {
            connection.release();
            console.log(error);
            reject(error);
        }
    })
}

module.exports = AlergiesModel;