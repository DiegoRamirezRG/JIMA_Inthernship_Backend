const AuthModel = require('../../models/auth/authModel');

module.exports = {

    async getAuth(req, res, next){
        try {
            const auth = await AuthModel.authorization(req.body);

            if(!auth.success){
                res.status(401).json({
                    success: auth.success,
                    message: auth.message
                })
            }else{
                res.status(201).json({
                    success: true,
                    message: 'Usuario authenticado',
                    data: auth.data
                });
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Ha ocurrido un error al autenticarse',
                error: error
            })
        }
    },

    async validateToken(req, res, next){
        try {
            
            const validate = await AuthModel.validateToken(req.params.token);

            res.status(201).json({
                success: validate.success,
                message: 'Token validado',
                data: validate.data
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Ha ocurrido un error al validar el token',
                error: error
            })
        }
    }

}