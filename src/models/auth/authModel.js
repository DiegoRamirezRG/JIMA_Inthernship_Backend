const crypto = require('crypto');
const db = require('../../config/databaseConfig');
const AuthHelper = require('../../utils/authHelpers/authHelpers');
const AuthModel = {};

AuthModel.authorization = async (crendecials) => {
    try {
        
        const connection = await db.getConnection();
        const {email, password} = crendecials;
        
        //Authorizacion 
        const [validateEmail] = await connection.query(`SELECT COUNT(*) as 'existe' FROM credenciales WHERE correo = "${email}"`);

        if(validateEmail[0].existe == 0){
            connection.release();
            return {
                success: false,
                message: 'El usuario no existe'
            };
        }else if(validateEmail[0].existe > 1){
            return {
                success: false,
                message: 'Hubo un error en la autenticacion, por favor comuniquese con su institucion. Problema--- Correo duplciado'
            }
        }else{
            //Validate CoolDown
            await AuthHelper.verifyCooldown(email);

            const [validatePassword] = await connection.query(`SELECT p.*, c.contraseña FROM credenciales as c, persona as p WHERE c.FK_Persona = p.ID_Persona AND c.correo = "${email}"`);
            const passwordHashed = crypto.createHash('md5').update(password).digest('hex');

            if(validatePassword[0].contraseña === passwordHashed){
                
                validatePassword[0].jwt = await AuthHelper.makeJWT(email, validatePassword[0].ID_Persona);
                connection.release();

                delete validatePassword[0].contraseña;

                return {
                    success: true,
                    data: validatePassword[0]
                };
            }else{

                await AuthHelper.authFailed(email);
                connection.release();
                return {
                    success: false,
                    message: 'La contraseña no coincide'
                };
            }
        }

    } catch (error) {
        return {
            success: false,
            message: error.message
        }
    }
}

AuthModel.validateToken = async (token) => {
    try {
        
        const decodedToken = await AuthHelper.validate(token);
        return{
            success: true,
            data: decodedToken
        }

    } catch (error) {
        return {
            success: false,
            message: error.message
        }
    }
}

AuthModel.getUserByJWT = async (token) => {
    const connection = await db.getConnection();
    const [authUser] = await connection.query(`SELECT p.*, c.contraseña FROM credenciales as c, persona as p WHERE c.FK_Persona = p.ID_Persona AND c.Token_De_Sesion = "${token}"`);
    
    if(authUser.length === 0){
        connection.release();
        return {
            success: false
        }
    }else{
        connection.release();
        return {
            success: true,
            data: authUser[0]
        }
    }

}

module.exports = AuthModel;