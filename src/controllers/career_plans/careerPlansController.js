const CareerPlansModel = require('../../models/career_plans/careerPlansModel');
const CareerModel = require('../../models/careers/careersModel');

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
    },

    async createCareerPlan(req, res, next){
        try {

            const { idCarrera, materias, previas } = req.body;

            const createdPlan = await CareerPlansModel.createPlan(idCarrera, materias, previas);

            return res.status(201).json({
                success: true,
                message: 'Plan de estudio creado con exito',
                data: createdPlan
            })
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Ha ocurrido un error al crear el Plan de estudio',
                error: error.message || error
            })
        }
    },

    async getPlans(req, res, next){
        try {
            const careers = await CareerModel.getAllCareers();
            const careersPlans = await CareerPlansModel.getPlanMinimalDetailsByCareers(careers);

            const careerPlansComplet = {};

            if(careersPlans.length <= 0){
                return res.status(201).json({
                    success: true,
                    message: 'No existen planes en el sistema',
                    data: []
                })
            }

            for (let i = 0; i < careers.length; i++) {

                let sumaCreditos = 0;
                let materiasNumber = 0;

                for (let j = 0; j < careersPlans[i].length; j++) {
                    sumaCreditos += careersPlans[i][j].Creditos;
                    materiasNumber += 1;
                }
                
                if (!careerPlansComplet[i]) {
                    careerPlansComplet[i] = {
                        ...careers[i],
                        creditos: sumaCreditos,
                        numMaterias: materiasNumber
                    };
                }
            }

            return res.status(201).json({
                success: true,
                message: 'Planes de estudios obtenidos con exito',
                data: careerPlansComplet
            })

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Ha ocurrido un error al obtener los Planes de estudios',
                error: error.message || error
            })
        }
    },

    async getSubjectsByCicle(req, res, next){
        try {
            const career = req.params.career;
            const cicle = req.params.cicle;

            const data = await CareerPlansModel.getSubjectsPerCicle(career, cicle);

            return res.status(201).json({
                success: true,
                message: 'Se han obtenido con exito las materias',
                data: data
            })

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Ha ocurrido un error al obtener las materias del plan de estudio',
                error: error.message || error
            })
        }
    },

    async getReinscriptionNextPlanSubjects(req, res, next){
        try {
            const { groups } = req.body;
            console.log(groups);

            const data = await CareerPlansModel.getNextSubjectsByGroup(groups);

            return res.status(201).json({
                success: true,
                message: 'Se han obtenido con exito las materias',
                data: data
            })

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Ha ocurrido un error al obtener las materias del plan de estudio',
                error: error.message || error
            })
        }
    }
}