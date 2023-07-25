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

    }

}