const CredentialsModule = require('../../models/credentials/credentialsModel');
const UsersModel = require('../../models/users/usersModel');

module.exports = {

    async getCredentialsByUserId(req, res, next){
        try {

            const userId = req.params.userId;
            const credentials = await CredentialsModule.getCredentialsByUserId(userId);

            return res.status(201).json({
                success: true,
                message: 'Datos obtenidos con exito',
                data: credentials
            })


        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Ha ocurrido un error al obtener las credenciales',
                error: error
            })
        }
    },

    async updateCredentials(req, res, next){
        try {
            
            const userId = req.params.userId;
            await UsersModel.verifyUserId(userId);

            const {password, email} = req.body;
            await CredentialsModule.updateCredentials(userId, password, email);

            return res.status(201).json({
                success: true,
                message: 'Datos actualizados con exito',
                data: userId
            })

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Ha ocurrido un error al actualizando las credenciales',
                error: error.message
            })
        }
    }

}