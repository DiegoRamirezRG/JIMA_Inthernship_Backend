
const db = require('../../config/databaseConfig');
const UsersModel = {};

UsersModel.getUsers = async (where, offset, order_by) => {

    const connection = await db.getConnection();

    return new Promise(async (resolve, reject) => {
        try {
            const [users] = await connection.query(`SELECT ID_Persona, Nombre, Apellido_Paterno, Apellido_Materno, Rol, Active, Imagen FROM persona${where != "" ? ' WHERE '+where+' ': ' '}${order_by != "" ? 'ORDER BY '+order_by+' ' : ' '}LIMIT 10 OFFSET ${offset}`);
            connection.release();

            resolve(users);
        } catch (error) {
            connection.release();
            reject(error);
        }
    })
}

UsersModel.getPagination = async(where) => {
    const connection = await db.getConnection();
    return new Promise(async (resolve, reject) => {
        try {
            const [pagination] = await connection.query(`SELECT COUNT(*) as Pag FROM persona${where != "" ? ' WHERE '+where+' ': ' '}`);
            connection.release();

            const pag = Math.ceil(pagination[0].Pag / 10);
            resolve(pag);
        } catch (error) {
            connection.release();
            reject(error);
        }
    });
}

module.exports = UsersModel;