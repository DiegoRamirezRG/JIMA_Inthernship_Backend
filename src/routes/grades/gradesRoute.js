const GradesController = require("../../controllers/grades/gradesController")
const middleware = require("../../middleware/jwtValidatorMiddleware")

module.exports = (app) => {
    app.get('/api/grades/getStudentTurned/:assigment_id', middleware, GradesController.getAllStudentsTurnedIn);

    app.put('/api/grades/setStudentGrades', middleware, GradesController.upadteTurnedInGrade);
}