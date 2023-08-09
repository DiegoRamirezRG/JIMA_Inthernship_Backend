
const UsersController = require('../../controllers/users/usersController');

module.exports = (app) => {

    app.get('/api/users/getAllUsers', UsersController.getUsers);

}