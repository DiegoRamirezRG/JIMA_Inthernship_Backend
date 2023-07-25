const AuthModel = require('../../models/auth/authModel');

module.exports = {

    async getAuth(req, res, next){
        const resposne = await AuthModel.authorization('dwahdwj');
        return res.json(resposne);
    }

}