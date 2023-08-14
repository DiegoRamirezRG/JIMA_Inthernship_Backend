const middleware = require('../../middleware/jwtValidatorMiddleware');
const UsersController = require('../../controllers/users/usersController');

module.exports = (app) => {

    app.post('/api/users/getAllUsers', middleware, UsersController.getUsers);
    app.post('/api/users/getPagination', middleware, UsersController.getPagination);

}