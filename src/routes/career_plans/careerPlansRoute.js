const middleware = require('../../middleware/jwtValidatorMiddleware');
const CareerPlansController = require('../../controllers/career_plans/careerPlansController');

module.exports = (app) => {
    app.get('/api/plans/validCareerPlans', middleware, CareerPlansController.validateCareerPlans);
    app.get('/api/plans/getPlans', middleware, CareerPlansController.getPlans);
    app.get('/api/plans/getSubjectsByCicle/:career/:cicle', middleware, CareerPlansController.getSubjectsByCicle);
    
    app.post('/api/plans/createPlan', middleware, CareerPlansController.createCareerPlan);
    app.post('/api/plans/getSubjectsByCicle/reinscriptions', middleware, CareerPlansController.getReinscriptionNextPlanSubjects);
}