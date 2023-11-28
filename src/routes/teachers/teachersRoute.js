const middleware = require('../../middleware/jwtValidatorMiddleware');
const TeachersController = require('../../controllers/teachers/teachersController');

module.exports = (app) => {

    app.get('/api/teachers/getActiveTeachers', middleware, TeachersController.getAllTeachers);
    app.get('/api/teachers/getAllTeachers', middleware, TeachersController.getAllTeachers)
    app.get('/api/teachers/getClasses/:teacher_id', middleware, TeachersController.getClassesByTeacherId);

}