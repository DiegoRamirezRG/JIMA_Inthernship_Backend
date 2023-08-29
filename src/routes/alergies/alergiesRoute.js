const middleware = require('../../middleware/jwtValidatorMiddleware');
const AlergiesController = require('../../controllers/alergies/AlergiesController');

module.exports = (app) => {

    app.get('/api/alergies/getAlergies/:userId', middleware, AlergiesController.getAlergiesByUserId);

}