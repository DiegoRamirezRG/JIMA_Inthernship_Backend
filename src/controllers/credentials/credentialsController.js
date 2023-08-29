const CredentialsModule = require('../../models/credentials/credentialsModel');

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
    }

}