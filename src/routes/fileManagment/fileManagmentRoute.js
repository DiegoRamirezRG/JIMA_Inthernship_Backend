const middleware = require('../../middleware/jwtValidatorMiddleware');
const FileManagmentController = require('../../controllers/fileManagment/fileManagmentController');

module.exports = (app) => {
    
    app.get('/api/files/download/homework/:assign_id/:file_name', middleware, FileManagmentController.downloadATeacherAttachedFile);
    app.get('/api/files/download/homework/:assign_id/:person_id/:file_name', middleware, FileManagmentController.downloadStudentAttachedFilesByName);

}