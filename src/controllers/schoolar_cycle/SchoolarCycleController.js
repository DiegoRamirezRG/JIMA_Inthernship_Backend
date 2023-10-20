const SchoolarCycleModel = require('../../models/schoolar_cycle/SchoolarCycleModel');
const CalendarModel = require('../../models/calendar/calendarModel');

module.exports = {

    async getBasicInitialDates(req, res, next){
        try {

            const calendarId = await CalendarModel.isCalendarActiveAndAvailable();

            if(calendarId === false){
                throw new Error('No existe un calendario activo');
            }

            const data = await SchoolarCycleModel.getCycleStat(calendarId);

            return res.status(201).json({
                success: true,
                message: 'Eventos Iniciales Existentes',
                data: data
            })
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Ha ocurrido un error al obtener los Eventos Inicialez',
                error: error.message || error
            })
        }
    }

}