const middleware = require('../../middleware/jwtValidatorMiddleware');
const CareerPlansController = require('../../controllers/career_plans/careerPlansController');

module.exports = (app) => {
    app.get('/api/plans/validCareerPlans', middleware, CareerPlansController.validateCareerPlans);
}