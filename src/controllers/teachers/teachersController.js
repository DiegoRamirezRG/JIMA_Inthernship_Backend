const TeacherModels = require('../../models/teachers/teachersModel');

module.exports = {

    async getAllTeachers(req, res, next){
        try {
            const data = await TeacherModels.getActiveTeachers();
            return res.status(201).json({
                success: true,
                message: 'Profesores obtenidos con exito',
                data: data
            })
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Ha ocurrido un error al obtener los Profesores',
                error: error.message || error
            })
        }
    },

    async getClassesByTeacherId (req, res, next){
        try {

            const classes = await TeacherModels.getClassesByTeacherId(req.params.teacher_id);

            return res.status(201).json({
                success: true,
                message: 'Clases Obtenidas con exito',
                data: classes
            })
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Ha ocurrido un error al obtener las Clases',
                error: error.message || error
            })
        }
    },

    async getTeachers(req, res, next){
        try {
            const data = await TeacherModels.getAllTeachers();
            return res.status(201).json({
                success: true,
                message: 'Profesores obtenidos con exito',
                data: data
            })
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Ha ocurrido un error al obtener los Profesores',
                error: error.message || error
            })
        }
    }

}