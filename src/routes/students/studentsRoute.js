const middleware = require('../../middleware/jwtValidatorMiddleware');
const StudentsController = require('../../controllers/students/studentsController');

module.exports = (app) => {

    app.get('/api/students/getUserData/:id_user', middleware, StudentsController.getStudentData);
    app.get('/api/students/getActiveEnroll/:id_student', middleware, StudentsController.getActiveEnroll);
    app.get('/api/students/getLastYearStudents', middleware, StudentsController.getLastStudents);
    app.get('/api/students/toBe/getStudentsToBe', middleware, StudentsController.getStudentsToBe);
    app.get('/api/students/getClasses/:person_id', middleware, StudentsController.getStudentClassesById);
    app.get('/api/students/getToDoAssigns/:person_id', middleware, StudentsController.getStdudentToDoAssigments);

    app.delete('/api/students/toBe/cancelRegister/:user_id', middleware, StudentsController.cancelStudentToBeRegister);

    app.post('/api/students/toBe/registerStudent', middleware, StudentsController.registerStudentToBe);
    app.post('/api/students/enroll/custom', middleware, StudentsController.enrollStudentCustom);

}