const middleware = require('../../middleware/jwtValidatorMiddleware');
const UsersController = require('../../controllers/users/usersController');

module.exports = (app) => {

    app.post('/api/users/getAllUsers', middleware, UsersController.getUsers);
    app.post('/api/users/getPagination', middleware, UsersController.getPagination);
    app.post('/api/users/create', middleware, UsersController.createUser);
    
    app.post('/api/users/profile/upload/:user_id', middleware, UsersController.uploadUserProfile);

    app.get('/api/user/getUserById/:idUser', middleware, UsersController.getUserByID);
}