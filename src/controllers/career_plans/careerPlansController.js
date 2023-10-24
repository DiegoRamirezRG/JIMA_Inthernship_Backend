const CareerPlansModel = require('../../models/career_plans/careerPlansModel');

module.exports = {
    async validateCareerPlans(req, res, next){
        try {
            const isValid = await CareerPlansModel.getValidateCareerPlans();
            return res.status(201).json({
                success: true,
                message: isValid === true ? 'Las carreras tienen planes de estudio' : 'Las siguientes carreras requieren un plan de estudio',
                data: isValid
            })

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Ha ocurrido un error al obtener las Carreras',
                error: error.message || error
            })
        }
    }
}