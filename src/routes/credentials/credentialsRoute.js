const middleware = require('../../middleware/jwtValidatorMiddleware');
const CredentialsController = require('../../controllers/credentials/credentialsController');

module.exports = (app) => {
    
    app.get('/api/credentials/getCredentials/:userId', middleware, CredentialsController.getCredentialsByUserId);

}