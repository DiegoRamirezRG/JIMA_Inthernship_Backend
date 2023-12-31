const AuthController = require('../../controllers/auth/authController');

module.exports = (app) => {

    app.post('/api/auth/getAuthorized', AuthController.getAuth);

    app.get('/api/auth/validateToken/:token', AuthController.validateToken);
    app.get('/api/auth/getUserbyToken/:token', AuthController.getAuthUserByJwt);
    app.get('/api/auth/logout/:userId', AuthController.getLogout);

}