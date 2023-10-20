const middleware = require('../../middleware/jwtValidatorMiddleware');
const SchoolarCycleController = require('../../controllers/schoolar_cycle/SchoolarCycleController');

module.exports = (app) => {

    app.get('/api/cycle/getCycleStatus', middleware, SchoolarCycleController.getBasicInitialDates);
}