const AuthController = require('../../controllers/auth/authController');

module.exports = (app) => {

    app.post('/api/auth/getAuthorized', AuthController.getAuth);

}