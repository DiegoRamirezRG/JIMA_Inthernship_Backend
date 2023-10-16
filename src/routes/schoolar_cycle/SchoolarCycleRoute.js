const middleware = require('../../middleware/jwtValidatorMiddleware');
const SchoolarCycleController = require('../../controllers/schoolar_cycle/SchoolarCycleController');

module.exports = (app) => {

    app.get('/api/cycle/getBasicDates', middleware, SchoolarCycleController.getBasicInitialDates);

}