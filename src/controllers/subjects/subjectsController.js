const SubjectsModel = require('../../models/subjects/subjectsModel');

module.exports = {
    
    async getAllSubjects(req, res, next){
        try {
            const subjects = await SubjectsModel.allSubjects();

            return res.status(201).json({
                success: true,
                message: 'Materias obtenidas con exito',
                data: subjects || []
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Ha ocurrido un error al obtener las Materias',
                error: error.message || error
            })
        }
    },

    async createSubject(req, res, enxt){
        try {
            
            const { Nombre, Descripcion, Codigo_De_Materia, Creditos, Horas_De_Clase, FK_Area } = req.body;
            await SubjectsModel.verifyArea(FK_Area);
            await SubjectsModel.createSubject(Nombre, Descripcion, Codigo_De_Materia, Creditos, Horas_De_Clase, FK_Area);

            return res.status(201).json({
                success: true,
                message: 'Materias creada con exito',
                data: true
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Ha ocurrido un error al craar la Materias',
                error: error.message || error
            })
        }
    },

    async getAllAreas (req, res, next){
        try {

            const areas = await SubjectsModel.getAreas();

            return res.status(201).json({
                success: true,
                message: 'Areas obtenidas con exito',
                data: areas || []
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Ha ocurrido un error al obtener las Areas',
                error: error.message || error
            })
        }
    },

    async createArea(req, res, next){
        try {
            
            const { Nombre, Descripcion, Codigo_De_Area } = req.body;
            await SubjectsModel.createArea(Nombre, Descripcion, Codigo_De_Area);

            return res.status(201).json({
                success: true,
                message: 'Area creada con exito',
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Ha ocurrido un error al crear el Area',
                error: error.message || error
            })
        }
    }

}