const db = require('../../config/databaseConfig');
const AuthModel = {};

AuthModel.authorization = async (crendecials) => {
    return 'Okey works';
}


module.exports = AuthModel;