const AttendanceModel = require('../../models/attendance/attendanceModel');

module.exports = {

    async getTodayAttendaceByClassId(req, res, next){
        try {
            
            const class_id = req.params.class_id;
            const data = await AttendanceModel.getTodayAttendance(class_id);

            return res.status(201).json({
                success: true,
                message: 'Asistencia obtenida con exito',
                data: data
            })

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Ha ocurrido un error al obtener la asistencia del dia',
                error: error.message
            })
        }
    },

    async insertOrUpdateTheAttendance(req, res, next){
        try {
            const { attendance } = req.body;
            await AttendanceModel.takeTodayAttendance(attendance);

            return res.status(201).json({
                success: true,
                message: 'Se ha tomato la asistencia con exito'
            })

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Ha ocurrido un error al tomar la asistencia',
                error: error.message
            })
        }
    }

}