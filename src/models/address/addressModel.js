const db = require('../../config/databaseConfig');
const AddressModel = {};

AddressModel.getAddressByUserId = async (userId) => {
    const connection = await db.getConnection();
    return new Promise(async (resolve, reject) => {
        try {
            const [result] = await connection.query(`SELECT Ciudad, Estado, Pais, Codigo_Postal, Numero_Interior, Numero_Exterior, Calle FROM direccion WHERE FK_Persona = "${userId}"`);
            connection.release();
            resolve(result[0]);
        } catch (error) {
            connection.release();
            console.log(error.message);
            reject(error);
        }
    })
}

module.exports = AddressModel;