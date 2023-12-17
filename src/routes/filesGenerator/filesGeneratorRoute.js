const middleware = require('../../middleware/jwtValidatorMiddleware');
const FilesGeneratorController = require('../../controllers/filesGenerator/filesGeneratorController');

module.exports = (app) => {

    app.get('/api/student/schedule/generateSchedule/:person_id', FilesGeneratorController.studentGenerateSchedulePdf);
    app.get('/api/student/kardex/generateKardex/:person_id', FilesGeneratorController.studentGenerateKardePdf);
    app.get('/api/student/grades/generateGradesReport/:person_id', FilesGeneratorController.studentGenerateGradeReporPdf);
    app.get('/api/student/grades/generateGradesReport/:person_id/:class_id', FilesGeneratorController.studentGenerateGradeReporPdf);
    app.get('/api/payments/generatePayment/:person_id/:payment_id', FilesGeneratorController.personGeneratePaymentReport);

}