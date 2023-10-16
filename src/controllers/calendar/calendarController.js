const CalendarModel = require('../../models/calendar/calendarModel');
const moment = require('moment');
require('moment/locale/es');

module.exports = {

    async createNewCalendar(req, res, next){
        try {
            const { Nombre, Inicio, Fin } = req.body;
            let nameHelper = '';

            if(!Inicio || !Fin){
                throw new Error('Datos faltantes');
            }

            if(!Nombre){
                const init = moment({ month: parseInt(Inicio.split('-')[1]) - 1 });
                const end = moment({ month: Fin.split('-')[1] - 1 });
                nameHelper = `${capitalizeString(init.format('MMMM')).slice(0, 3)} ${init.format('YY')} / ${capitalizeString(end.format('MMMM')).slice(0, 3)} ${end.format('YY')}`;
            }

            const availableCreate = await CalendarModel.isCalendarActiveAndAvailable();
            if(availableCreate == true){
                throw new Error('Ya existe un Calendario activo');
            }

            await CalendarModel.createNewCalendar(!Nombre ? nameHelper : Nombre, Inicio, Fin);

            return res.status(201).json({
                success: true,
                message: 'Calendario creado con exito'
            });
        } catch (error) {
            console.log(error);
            return res.status(501).json({
                success: false,
                message: 'Ha ocurrido un error al crear el Calendario',
                error: error.message
            });
        }
    },

    async getActiveCalendar(req, res, next){
        try {
            const calendar = await CalendarModel.isCalendarActiveAndAvailable();
            if(calendar == false){
                return res.status(201).json({
                    success: true,
                    message: 'No existe ningun calendario Activo',
                    data: null
                });
            }

            const calendarData = await CalendarModel.getCalendarInfo(calendar);
            return res.status(201).json({
                success: true,
                message: 'Calendario obtenido con exito',
                data: calendarData
            });
        } catch (error) {
            return res.status(501).json({
                success: false,
                message: 'Ha ocurrido un error al obtener el Calendario',
                error: error.message
            });
        }
    },

    async getCalendarEvents(req, res, next){
        try {
            
            const calendar = await CalendarModel.isCalendarActiveAndAvailable();
            if(!calendar){
                return res.status(201).json({
                    success: true,
                    message: 'No existe ningun calendario Activo',
                    data: null
                });
            }

            const events = await CalendarModel.getActiveEvents(calendar);

            return res.status(201).json({
                success: true,
                message: 'Calendario obtenido con exito',
                data: events || {}
            });

        } catch (error) {
            return res.status(501).json({
                success: false,
                message: 'Ha ocurrido un error al obtener los Eventos del Calendario',
                error: error.message
            });
        }
    },

    async createNewEvent(req, res, next){
        try {
            
            const { Titulo, Descripcion, Fecha_Inicio, Fecha_Fin, Color, ID_Calendario } = req.body;

            if(!Titulo || !Fecha_Inicio || !Color || !ID_Calendario){
                throw new Error('Datos faltantes');
            }

            const newId = await CalendarModel.createCalendarEvent(Titulo, Descripcion, Fecha_Inicio, Fecha_Fin, Color, ID_Calendario);
            return res.status(201).json({
                success: true,
                message: 'Evento creado con exito',
                data: newId
            });

        } catch (error) {
            return res.status(501).json({
                success: false,
                message: 'Ha ocurrido un error al crear los Eventos del Calendario',
                error: error.message || error
            });
        }
    },

    async updateAnActiveEvent(req, res, next){
        try {
            const { ID_Calendario_Eventos, Titulo, Descripcion, Fecha_Inicio, Fecha_Fin, Color } = req.body;

            if(!ID_Calendario_Eventos || !Titulo || !Fecha_Inicio || !Color){
                throw new Error('Datos faltantes');
            }

            await CalendarModel.updateAnEvent(ID_Calendario_Eventos, Titulo, Descripcion, Fecha_Inicio, Fecha_Fin, Color);
            return res.status(201).json({
                success: true,
                message: 'Evento actualizado con exito',
            })
        } catch (error) {
            return res.status(501).json({
                success: false,
                message: 'Ha ocurrido un error al crear los Eventos del Calendario',
                error: error.message || error
            });
        }
    }
}


function capitalizeString(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}