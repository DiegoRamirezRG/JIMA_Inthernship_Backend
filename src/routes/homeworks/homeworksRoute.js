const middleware = require('../../middleware/jwtValidatorMiddleware');
const HomeworkController = require('../../controllers/homework/homeworkController');

module.exports = (app) => {

    app.get('/api/homeworks/rubric/getAllRubrics/:person_id', middleware, HomeworkController.getRubricsByPersonId);
    app.get('/api/homeworks/unit/getClassUnits/:class_id', middleware, HomeworkController.getAllUnitsByClassId);
    app.get('/api/homeworks/work/getAllWorks/:class_id', middleware, HomeworkController.getAllAssigmentsWork);
    app.get('/api/homeworks/work/getAttachedFiles/:assign_id', middleware, HomeworkController.getAttachedFiles);
    app.get('/api/homeworks/work/workStatus/:assign_id/:person_id', middleware, HomeworkController.getHomeworkStudentStatus)

    app.get('/api/homeworks/work/getStudentWork/:class_id/:person_id', middleware, HomeworkController.getStudentTurnInGradesByClass);
    app.get('/api/homeworks/work/getGrades/:assigment/:person_id', middleware, HomeworkController.getStudentAssigmentStatus);

    app.post('/api/homeworks/rubric/createRubric', middleware, HomeworkController.createRubric);
    app.post('/api/homeworks/unit/createUnit', middleware, HomeworkController.createUnit);
    app.post('/api/homeworks/work/createWork', middleware, HomeworkController.createWork);
    app.post('/api/homeworks/work/uploadFile/:assigment_id', middleware, HomeworkController.uploadAssigmentFiles);

    app.post('/api/homeworks/work/turn_in', middleware, HomeworkController.turnInAssigments);
    app.post('/api/homeworks/work/turn_in/uploadFiles/:assigment_id/:person_id', middleware, HomeworkController.uploadStudentTurnInFile);
}