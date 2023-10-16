
const AuthRoutes = require('./auth/authRoute');
const UsersRoutes = require('./users/usersRoute');
const RolesRoutes = require('./roles/rolesRoute');
const CredentialsRoutes = require('./credentials/credentialsRoute');
const AlergiesRoutes = require('./alergies/alergiesRoute');
const AddressRoutes = require('./address/adressRoute');
const LocationRoutes = require('./location/locationRoute');
const StadisticsRoutes = require('./stadistics/stadisticsRoute');
const CareerRoutes = require('./careers/careersRoute');
const SchoolInfoRoutes = require('./school_info/school_infoRoute');
const CalendarRoutes = require('./calendar/calendarRoute');
const StudentRoutes = require('./students/studentsRoute');
const SchoolarCycleRoutes = require('./schoolar_cycle/SchoolarCycleRoute');

module.exports = (app) => {

    AuthRoutes(app);
    UsersRoutes(app);
    RolesRoutes(app);
    CredentialsRoutes(app);
    AlergiesRoutes(app);
    AddressRoutes(app);
    LocationRoutes(app);
    StadisticsRoutes(app);
    CareerRoutes(app);
    StudentRoutes(app);
    SchoolInfoRoutes(app);
    CalendarRoutes(app);
    SchoolarCycleRoutes(app);
}