const middleware = require('../../middleware/jwtValidatorMiddleware');
const AlergiesController = require('../../controllers/alergies/AlergiesController');

module.exports = (app) => {

    app.get('/api/alergies/getAlergies/:userId', middleware, AlergiesController.getAlergiesByUserId);

    app.put('/api/alergies/update/:userId', middleware, AlergiesController.updateAlergiesData);

}