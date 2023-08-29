const db = require('../../config/databaseConfig');
const CredentialModel = {};

CredentialModel.getCredentialsByUserId = async (userId) => {

    const connection = await db.getConnection();
    return new Promise(async (resolve, reject) => {
        try {
            
            const [credenciales] = await connection.query(`SELECT Correo, Contraseña FROM credenciales WHERE FK_Persona = "${userId}"`);
            connection.release();
            resolve(credenciales[0]);

        } catch (error) {
            connection.release();
            console.log(error);
            reject(error);
        }
    })

}

module.exports = CredentialModel;