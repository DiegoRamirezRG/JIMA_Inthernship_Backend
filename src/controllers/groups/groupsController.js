const GroupsModel = require('../../models/groups/groupsModel');

module.exports = {

    async getClassInfo(req, res, next){
        try {
            
            const classId = req.params.class_id;
            const data = await GroupsModel.getClassData(classId);

            return res.status(201).json({
                success: true,
                message: 'Se ha obtenido el grupo con exito',
                data: data
            })

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Ha ocurrido un error al obtener el grupo',
                error: error.message || error
            })
        }
    },

    async getClassSchedule(req, res, next){
        try {
            
            const classId = req.params.class_id;
            const data = await GroupsModel.getScheduleByClassId(classId);

            return res.status(201).json({
                success: true,
                message: 'Se ha obtenido el horario del grupo con exito',
                data: data
            })

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Ha ocurrido un error al obtener el horario del grupo',
                error: error.message || error
            })
        }
    },

    async getClassAttendance(req, res, next){
        try {
            const classId = req.params.class_id;
            const data = await GroupsModel.getAssistanceList(classId);

            return res.status(201).json({
                success: true,
                message: 'Se ha obtenido la lista de asistencia con exito',
                data: data
            })
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Ha ocurrido un error al obtener la lista de asistencia del grupo',
                error: error.message || error
            })
        }
    }

}