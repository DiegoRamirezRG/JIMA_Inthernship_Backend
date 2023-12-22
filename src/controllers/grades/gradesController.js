const GradeModel = require('../../models/grades/gradesModel');

module.exports = {

    async getAllStudentsTurnedIn(req, res, next){
        try {
            const assigment_id = req.params.assigment_id;

            const data = await GradeModel.getStudentTurnedIn(assigment_id);

            return res.status(201).json({
                success: true,
                message: 'Entregas traidas con exito',
                data: data
            })

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Ha ocurrido un error al obtener las entregas',
                error: error.message || error
            })
        }
    },

    async upadteTurnedInGrade(req, res, next){
        try {
            
            const { grades } = req.body;

            await GradeModel.updateTurnedGrades(grades);

            return res.status(201).json({
                success: true,
                message: 'Calificaciones subidas con exito'
            })

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Ha ocurrido un error al actualizar las calificaciones',
                error: error.message || error
            })
        }
    }

}