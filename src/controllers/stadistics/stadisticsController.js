const StadisticsModel = require('./../../models/stadistics/stadisticsModel');

module.exports = {

    async getTotalUsers(req, res, next){
        try {
            const data = await StadisticsModel.getTotalUsers();
            return res.status(201).json({
                success: true,
                message: 'Estadisticas obtenidas con exito',
                data: data
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Ha ocurrido un error al obtener las estadisticas de Usuarios',
                error: error.message
            })
        }
    },

    async getTotalStudentToBe(req, res, next){
        try {
            const data = await StadisticsModel.getTotalStudentToBe();
            return res.status(201).json({
                success: true,
                message: 'Estadisticas obtenidas con exito',
                data: data
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Ha ocurrido un error al obtener las estadisticas de Aspirantes',
                error: error.message
            })
        }
    },

    async getTotalStudents(req, res, next){
        try {
            const data = await StadisticsModel.getTotalStudents();
            return res.status(201).json({
                success: true,
                message: 'Estadisticas obtenidas con exito',
                data: data
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Ha ocurrido un error al obtener las estadisticas de Estudiantes',
                error: error.message
            })
        }
    },

    async getTotalTeachers(req, res, next){
        try {
            const data = await StadisticsModel.getTotalTeachers();
            return res.status(201).json({
                success: true,
                message: 'Estadisticas obtenidas con exito',
                data: data
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Ha ocurrido un error al obtener las estadisticas de Profesores',
                error: error.message
            })
        }
    },

    async getTotalAdmins(req, res, next){
        try {
            const data = await StadisticsModel.getTotalAdmins();
            return res.status(201).json({
                success: true,
                message: 'Estadisticas obtenidas con exito',
                data: data
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Ha ocurrido un error al obtener las estadisticas de Administrativos',
                error: error.message
            })
        }
    },

    async getGenderStats(req, res, next){
        try {
            const data = await StadisticsModel.getGenderStats();
            return res.status(201).json({
                success: true,
                message: 'Estadisticas obtenidas con exito',
                data: data
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Ha ocurrido un error al obtener las estadisticas de Administrativos',
                error: error.message
            })
        }
    },

}