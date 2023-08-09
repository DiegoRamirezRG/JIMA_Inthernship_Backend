
const AuthRoutes = require('./auth/authRoute');
const UsersRoutes = require('./users/usersRoute');

module.exports = (app) => {

    AuthRoutes(app);
    UsersRoutes(app);
}