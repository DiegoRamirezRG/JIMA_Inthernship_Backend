const middleware = require('../../middleware/jwtValidatorMiddleware');
const SubjectController = require('../../controllers/subjects/subjectsController');

module.exports = (app) => {

    app.get('/api/subjects/getAllSubjects', middleware, SubjectController.getAllSubjects);
    app.get('/api/subjects/areas/getAllAreas', middleware, SubjectController.getAllAreas);

    app.post('/api/subjects/areas/createArea', middleware, SubjectController.createArea);
    app.post('/api/subjects/createSubject', middleware, SubjectController.createSubject);

}