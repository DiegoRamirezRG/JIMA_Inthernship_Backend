const db = require('../../config/databaseConfig');
const moment = require('moment');
const CalendarModel = {};

CalendarModel.createNewCalendar = async (name, init, end) => {
    const connection = await db.getConnection();
    return new Promise(async (resolve, reject) => {
        try {
            connection.beginTransaction();

            const [result] = await connection.query(`INSERT INTO calendario(Nombre, Inicio, Fin) VALUES ("${name}", "${init}", "${end}")`);
                
            if(result.affectedRows > 0){
                connection.commit();
                connection.release();
                resolve();
            }else{
                throw new Error('Ocurrio un error creando el Calendario');
            }
        } catch (error) {
            connection.rollback();
            connection.release();
            console.error(error.message);
            reject(error);
        }
    });
}

CalendarModel.getCalendarInfo = async (calendar_id) => {
    const connection = await db.getConnection();
    return new Promise(async (resolve, reject) => {
        try {
            
            const [result] = await connection.query(`SELECT * FROM calendario WHERE ID_Calendario = "${calendar_id}"`);
            connection.release();
            resolve(result[0])

        } catch (error) {
            connection.release();
            console.error(error.message);
            reject(error);
        }
    })
}

CalendarModel.isCalendarActiveAndAvailable = async () => {
    const connection = await db.getConnection();
    return new Promise(async (resolve, reject) => {
        try {
            const [isAvailable] = await connection.query('SELECT * FROM existActiveCalendar');
            connection.release();
            resolve(isAvailable[0].isExistingActiveCalendar);
        } catch (error) {
            connection.release();
            console.error(error.message);
            reject(error);
        }
    })
}

CalendarModel.getActiveEvents = async (calendar_id) => {
    const connection = await db.getConnection();
    return new Promise(async (resolve, reject) => {
        try {
            const [result] = await connection.query(`SELECT * FROM calendario_eventos WHERE FK_Calendario = "${calendar_id}" ORDER BY Fecha_Inicio ASC`);
            connection.release();
            resolve(result);
        } catch (error) {
            connection.release();
            console.error(error.message);
            reject(error);
        }
    })
}

CalendarModel.createCalendarEvent = async (Titulo, Descripcion, Fecha_Inicio, Fecha_Fin, Color, ID_Calendario) => {
    const connection = await db.getConnection();
    return new Promise(async (resolve, reject) => {
        try {
            connection.beginTransaction();

            const [validDates] = await connection.query(`SELECT Inicio, Fin FROM calendario WHERE ID_Calendario = "${ID_Calendario}"`);

            const calendarEndDate = moment(validDates[0].Fin, 'YYYY-MM-DD');
            const calendarInitDate = moment(validDates[0].Inicio, 'YYYY-MM-DD');
            const eventInitDate = moment(Fecha_Inicio);

            if(eventInitDate.isBefore(calendarInitDate) || eventInitDate.isAfter(calendarEndDate)){
                throw new Error('El evento no puede ser añadido pues este inicia fuera de las fechas validas en el calendario');
            }

            if(Fecha_Fin){
                const eventEndDate = moment(Fecha_Fin);
                if(eventEndDate.isAfter(calendarEndDate)){
                    throw new Error('El evento no puede ser añadido pues este termina despues de la fecha valida en el calendario');
                }
            }

            const [result] = await connection.query(`INSERT INTO calendario_eventos (Titulo, Descripcion, Fecha_Inicio, Fecha_Fin, Color, FK_Calendario) VALUES("${Titulo}", ${Descripcion ? `"${Descripcion}"` : null}, "${Fecha_Inicio}", ${Fecha_Fin ? `"${Fecha_Fin}"` : null}, "${Color}", "${ID_Calendario}")`);
            if(result.affectedRows > 0){
                connection.commit();
                connection.release();
                resolve();
            }else{
                throw new Error('Error al crear el evento');
            }
        } catch (error) {
            connection.rollback();
            connection.release();
            console.error(error.message);
            reject(error);
        }
    })
}

module.exports = CalendarModel;