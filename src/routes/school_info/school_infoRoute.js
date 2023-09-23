const middleware = require('../../middleware/jwtValidatorMiddleware');
const SchoolInfoController = require('../../controllers/school_info/school_infoController');

module.exports = (app) => {

    app.get('/api/school/info/shifts/getShifts', middleware, SchoolInfoController.getSchoolShifts);
    app.post('/api/school/info/shifts/createShift', middleware, SchoolInfoController.createSchoolShift);
    app.put('/api/school/info/shift/updateShift', middleware, SchoolInfoController.updateSchoolShift);
    
    app.get('/api/school/info/grades/getGrades', middleware, SchoolInfoController.getSchoolGrades);
    app.post('/api/school/info/grades/createGrade', middleware, SchoolInfoController.createSchoolGrade);


    app.get('/api/school/info/groups/getGroups', middleware, SchoolInfoController.getSchoolGroups);
    app.post('/api/school/info/groups/createGroup', middleware, SchoolInfoController.createSchoolGroup);


}