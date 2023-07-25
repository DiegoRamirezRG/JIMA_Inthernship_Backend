const AuthController = require('../../controllers/auth/authController');

module.exports = (app) => {

    app.get('/api/auth/getAuthorized', AuthController.getAuth);

}