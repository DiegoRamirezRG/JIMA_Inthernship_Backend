const middleware = require('../../middleware/jwtValidatorMiddleware');
const SchoolarCycleController = require('../../controllers/schoolar_cycle/SchoolarCycleController');

module.exports = (app) => {

    app.get('/api/cycle/getCycleStatus', middleware, SchoolarCycleController.getBasicInitialDates);

    app.post('/api/cycle/inscriptions/createGroups', middleware, SchoolarCycleController.createNewCycleGroup);

    app.put('/api/cycle/endSchoolarCycle', middleware, SchoolarCycleController.endTheSchoolarCycle);
}