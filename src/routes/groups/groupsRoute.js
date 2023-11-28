const middleware = require('../../middleware/jwtValidatorMiddleware');
const GroupsController = require('../../controllers/groups/groupsController');

module.exports = (app) => {
    app.get('/api/groups/getClassInfo/:class_id', middleware, GroupsController.getClassInfo);
    app.get('/api/groups/getClassSchedule/:class_id', middleware, GroupsController.getClassSchedule);
    app.get('/api/groups/getClassAttendance/:class_id', middleware, GroupsController.getClassAttendance);
}