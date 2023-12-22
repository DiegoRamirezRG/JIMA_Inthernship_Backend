const SchedulesModel = require('../../models/schedules/schedulesModel');

module.exports = {

    async getGroupsToSchedule(req, res, next){
        try {

            const groups = await SchedulesModel.getGroupsNeededOfLoad(1);

            return res.status(201).json({
                success: true,
                message: 'Grupos obtenidos con exito para cargar materias',
                data: groups
            })
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Ha ocurrido un error al obtener los grupos para cargar materias',
                error: error
            })
        }
    },

    async createSchedules(req, res, next){
        try {

            const { data } = req.body;
            await SchedulesModel.createSchedule(data);

            return res.status(201).json({
                success: true,
                message: 'Horarios creados con exito',
                data: 'Ciclo iniciado con exito'
            })
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Ha ocurrido un error al crear los horarios para los grupos',
                error: error
            })
        }
    },

    async getTeacherSchedule(req, res, next){
        try {
            
            const person_id = req.params.person_id;
            const data = await SchedulesModel.getTeacherSchedule(person_id);

            return res.status(201).json({
                success: true,
                message: 'Horarios obtenidos con exito',
                data: data
            })

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Ha ocurrido un error al obtener el horario del profesor',
                error: error
            })
        }
    },

    async getStudentSchedule(req, res, next){
        try {
            const person_id = req.params.person_id;
            const data = await SchedulesModel.getStudentSchedule(person_id);

            return res.status(201).json({
                success: true,
                message: 'Horarios obtenidos con exito',
                data: data
            })
            
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Ha ocurrido un error al obtener el horario del estudiante',
                error: error
            })
        }
    },

    async getShiftData(req, res, next){
        try {
            const shift_id = req.params.shift_id;
            const data = await SchedulesModel.getShiftData(shift_id);

            return res.status(201).json({
                success: true,
                message: 'Turno obtenido con exito',
                data: data
            })
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Ha ocurrido un error al obtener el turno',
                error: error
            })
        }
    },

    async createReinsSchedules(req, res, next){
        try {
            const { data } = req.body;
            await SchedulesModel.createReinsSchedule(data);

            return res.status(201).json({
                success: true,
                message: 'Horarios creados con exito',
                data: 'Ciclo iniciado con exito'
            })
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Ha ocurrido un error al crear los horarios para los grupos',
                error: error
            })
        }
    }

}