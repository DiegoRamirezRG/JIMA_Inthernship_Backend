const middleware = require('../../middleware/jwtValidatorMiddleware');
const CareersController = require('../../controllers/careers/careersController');

module.exports = (app) => {

    app.get('/api/careers/getAllCareers', middleware, CareersController.getCareers);
    app.get('/api/careers/getAllCareers/Actives', middleware, CareersController.getCareersActve);

    app.post('/api/careers/createCareer', middleware, CareersController.createCareer);

    app.put('/api/careers/updateCareer', middleware, CareersController.updateCareer);

}