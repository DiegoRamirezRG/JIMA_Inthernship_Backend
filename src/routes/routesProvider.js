
const AuthRoutes = require('./auth/authRoute');
const UsersRoutes = require('./users/usersRoute');
const RolesRoutes = require('./roles/rolesRoute');
const CredentialsRoutes = require('./credentials/credentialsRoute');
const AlergiesRoutes = require('./alergies/alergiesRoute');
const AddressRoutes = require('./address/adressRoute');

module.exports = (app) => {

    AuthRoutes(app);
    UsersRoutes(app);
    RolesRoutes(app);
    CredentialsRoutes(app);
    AlergiesRoutes(app);
    AddressRoutes(app);
}