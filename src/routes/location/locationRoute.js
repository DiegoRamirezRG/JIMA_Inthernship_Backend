const middleware = require('../../middleware/jwtValidatorMiddleware');
const LocationController = require('../../controllers/location/locationController');

module.exports = (app) => {

    app.get('/api/location/getCountries', middleware, LocationController.getCountries);
    app.get('/api/location/getStates/:countryName', middleware, LocationController.getStates);
    app.get('/api/location/getCities/:stateName', middleware, LocationController.getCities);

}