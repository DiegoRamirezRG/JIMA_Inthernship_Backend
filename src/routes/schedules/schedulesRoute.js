const ScheduleController = require('../../controllers/schedules/schedulesController');
const middleware = require('../../middleware/jwtValidatorMiddleware');

module.exports = (app) => {

    app.get('/api/schedule/getGroupToSchedule', middleware, ScheduleController.getGroupsToSchedule);
    app.get('/api/schedule/getTeacherSchedule/:person_id', middleware, ScheduleController.getTeacherSchedule);
    app.get('/api/schedule/getStudentSchedule/:person_id', middleware, ScheduleController.getStudentSchedule);
    app.get('/api/schedule/getShiftDetail/:shift_id', middleware, ScheduleController.getShiftData);

    app.post('/api/schedule/createSchedules', middleware, ScheduleController.createSchedules);
    app.post('/api/schedule/reinscription/createSchedules', middleware, ScheduleController.createReinsSchedules);
}