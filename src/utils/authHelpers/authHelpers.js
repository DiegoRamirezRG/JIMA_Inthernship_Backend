const moment = require('moment');
const jwt = require('jsonwebtoken');
const db = require('../../config/databaseConfig');
require('dotenv').config();

const AuthHelper = {};

AuthHelper.verifyCooldown = async (email) => {

    const connection = await db.getConnection();

    return new Promise(async (resolve, reject) => {
        
        const [results] = await connection.query(`SELECT c.Numero_De_Intentos, c.Ultimo_Intento FROM credenciales as c WHERE correo = "${email}"`);

        const { Numero_De_Intentos, Ultimo_Intento } = results[0];
        if(Numero_De_Intentos == 5 && moment().diff(moment(Ultimo_Intento), 'minutes') < 15){
            reject(new Error('Has realizado 5 intentos fallido de autenticacion, por favor espera 15 minutos'))
        }else if(Numero_De_Intentos == 5  && moment().diff(moment(Ultimo_Intento), 'minutes') > 15){
            connection.query(`UPDATE credenciales SET Numero_De_Intentos = 0 WHERE correo = "${email}"`);
            connection.release();
            resolve();
        }else{
            connection.release();
            resolve();
        }
    })
}

AuthHelper.authFailed = async (email) => {
    const connection = await db.getConnection();
    await connection.query(`UPDATE credenciales SET Numero_De_Intentos = Numero_De_Intentos + 1, Ultimo_Intento = NOW() WHERE correo = "${email}"`);
    connection.release();
}

AuthHelper.makeJWT = async(email, id) => {
    const connection = await db.getConnection();
    const token = jwt.sign({id: id}, process.env.SECRETJWTKEY, {
        expiresIn: '24h'
    });

    await connection.query(`UPDATE credenciales SET Numero_De_Intentos = 0, Token_De_Sesion = "${token}", Inicio_De_Sesion = NOW() WHERE correo = "${email}"`);
    connection.release();
    return token;
}

AuthHelper.validate = async (token) => {
    return new Promise(async (resolve, reject) => {
        jwt.verify(token, process.env.SECRETJWTKEY, (err, decoded) => {
            if(err){
                reject(new Error('El token no es valido'));
            }else{
                resolve(decoded);
            }
        })
    })
}

module.exports = AuthHelper;
