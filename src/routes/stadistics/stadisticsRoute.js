const middleware = require('../../middleware/jwtValidatorMiddleware');
const  StadisticsController = require('../../controllers/stadistics/stadisticsController');

module.exports = (app) => {

    app.get('/api/stadistics/users/getTotalUser', middleware, StadisticsController.getTotalUsers);
    app.get('/api/stadistics/users/getStudentsToBe', middleware, StadisticsController.getTotalStudentToBe);
    app.get('/api/stadistics/users/getStudents', middleware, StadisticsController.getTotalStudents);
    app.get('/api/stadistics/users/getTotalTeachers', middleware, StadisticsController.getTotalTeachers);
    app.get('/api/stadistics/users/getTotalAdmins', middleware, StadisticsController.getTotalAdmins);

    app.get('/api/stadistics/gender/students', middleware, StadisticsController.getGenderStats);
}