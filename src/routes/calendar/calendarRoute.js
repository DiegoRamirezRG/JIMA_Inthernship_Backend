const middleware = require('../../middleware/jwtValidatorMiddleware');
const CalendarController = require('../../controllers/calendar/calendarController.js');

module.exports = (app) => {

    app.post('/api/calendar/createNewCalendar', middleware, CalendarController.createNewCalendar);
    app.post('/api/calendar/createNewEvent', middleware, CalendarController.createNewEvent);

    app.get('/api/calendar/getActiveCalendar', middleware, CalendarController.getActiveCalendar);
    app.get('/api/calendar/getActiveEvents', middleware, CalendarController.getCalendarEvents);

    app.put('/api/calendar/updateEvent', middleware, CalendarController.updateAnActiveEvent);
}