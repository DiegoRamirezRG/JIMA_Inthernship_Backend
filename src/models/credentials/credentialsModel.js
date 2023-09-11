const db = require('../../config/databaseConfig');
const crypto = require('crypto');
const { format } = require('date-fns');

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

CredentialModel.updateCredentials = async (userId, password, email) => {
    const connection = await db.getConnection();
    
    return new Promise(async (resolve, reject) => {
        await connection.beginTransaction();

        try {
            const now = new Date();
            const formattedDate = format(now, 'yyyy-MM-dd HH:mm:ss');

            const hashedPassword = crypto.createHash('md5').update(password).digest('hex');
            const [updateCredentials] = await connection.query(`UPDATE credenciales SET Correo = "${email}"${password != '' ? `, Contraseña = "${hashedPassword}"` : ''}, Actualizado_EN = "${formattedDate}" WHERE FK_Persona = "${userId}"`);

            const [updateOnPersona] = await connection.query(`UPDATE persona SET Correo_Electronico = "${email}", Actualizado_EN = "${formattedDate}" WHERE ID_Persona = "${userId}"`);

            if(updateCredentials.affectedRows > 0 && updateOnPersona.affectedRows > 0){
                await connection.commit();
                connection.release();
                resolve();
            }else{
                throw new Error('Error al actualizar los campos');
            }
        } catch (error) {
            await connection.rollback();
            connection.release();
            console.log(error);
            reject(error);
        }
    })
}

module.exports = CredentialModel;