const middleware = require('../../middleware/jwtValidatorMiddleware');
const RolesController = require('../../controllers/roles/rolesController');

module.exports = (app) => {
    
    app.get('/api/roles/getInfo/:userId', middleware, RolesController.getRolInfoByUserId);

}