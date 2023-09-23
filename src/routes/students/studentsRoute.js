const middleware = require('../../middleware/jwtValidatorMiddleware');
const StudentsController = require('../../controllers/students/studentsController');

module.exports = (app) => {

    app.get('/api/students/getUserData/:id_user', middleware, StudentsController.getStudentData);

    app.delete('/api/students/toBe/cancelRegister/:user_id', middleware, StudentsController.cancelStudentToBeRegister);

    app.post('/api/students/toBe/registerStudent', middleware, StudentsController.registerStudentToBe);
    app.post('/api/students/enroll/custom', middleware, StudentsController.enrollStudentCustom);

}