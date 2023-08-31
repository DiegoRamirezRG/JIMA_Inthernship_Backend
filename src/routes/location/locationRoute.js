const middleware = require('../../middleware/jwtValidatorMiddleware');
const LocationController = require('../../controllers/location/locationController');

module.exports = (app) => {

    app.get('/api/location/getCountries', middleware, LocationController.getCountries);

}