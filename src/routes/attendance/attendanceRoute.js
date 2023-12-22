const middleware = require('../../middleware/jwtValidatorMiddleware');
const AttendanceController = require('../../controllers/attendance/attendanceController');

module.exports = (app) => {
    app.get('/api/attendance/getTodayAttendance/:class_id', middleware, AttendanceController.getTodayAttendaceByClassId);

    app.post('/api/attendance/takeClassAttendance', middleware, AttendanceController.insertOrUpdateTheAttendance);
}