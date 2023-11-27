const db = require('../../config/databaseConfig');
const CalendarModel = require('../calendar/calendarModel');
const SchoolarCycleModel = require('../schoolar_cycle/SchoolarCycleModel');
const SchedulesModel = {}

SchedulesModel.getGroupsNeededOfLoad = async (cicle) => {
    const connection = await db.getConnection();
    return new Promise(async (resolve, reject) => {
        try {
            const [result] = await connection.query(`CALL ObtenerDatosPorCiclo(${cicle})`);
            connection.release();

            resolve(result[0]);
        } catch (error) {
            connection.release();
            console.error(error);
            reject(error);
        }
    })
}

SchedulesModel.createSchedule = async (groups) => {
    const connection = await db.getConnection();
    return new Promise(async(resolve, reject) => {
        try {
            connection.beginTransaction();

            for (let i = 0; i < Object.values(groups).length; i++) {
                const [students] = await connection.query(`SELECT FK_Estudiante FROM inscripciones WHERE FK_Carrera = "${Object.values(groups)[i].id_Career}" AND FK_Grupo = "${Object.values(groups)[i].id_Grupo}" AND FK_Turno = "${Object.values(groups)[i].id_Turno}"`);

                for (let j = 0; j < Object.values(groups)[i].class_teacher.length; j++) {
                    await connection.query(`INSERT INTO clase(FK_Materia, FK_Profesor) VALUES ("${Object.values(groups)[i].class_teacher[j].FK_Materia}", "${Object.values(groups)[i].class_teacher[j].FK_Profesor}")`);
                    const [insertRes] = await connection.query(`SELECT ID_Clase FROM clase WHERE FK_Materia = "${Object.values(groups)[i].class_teacher[j].FK_Materia}" AND FK_Profesor = "${Object.values(groups)[i].class_teacher[j].FK_Profesor}" ORDER BY Creado_En DESC LIMIT 1`);
                    
                    //Schedule
                    for (let x = 0; x < Object.values(groups)[i].class_teacher[j].schedule.length; x++) {
                        const [schedule] = await connection.query(`INSERT INTO horario(Dia, Hora_Inicio, Hora_Fin, FK_Clase) VALUES ("${Object.values(groups)[i].class_teacher[j].schedule[x].Dia}", STR_TO_DATE("${Object.values(groups)[i].class_teacher[j].schedule[x].Hora_Inicio}", "%H:%i"), STR_TO_DATE("${Object.values(groups)[i].class_teacher[j].schedule[x].Hora_Fin}", "%H:%i"), "${insertRes[0].ID_Clase}")`);
                        if(schedule.affectedRows <= 0){
                            throw new Error('Ha ocurrido un error al ingresar los horarios');
                        }
                    }

                    for (let y = 0; y < students.length; y++) {
                        const [asginSche] = await connection.query(`INSERT INTO estudiante_clases(FK_Estudiante, FK_Clase) VALUES ("${students[y].FK_Estudiante}", "${insertRes[0].ID_Clase}")`);

                        if(asginSche <= 0){
                            throw new Error('Ha ocurrido un error al ingresar los horarios');
                        }
                    }
                }
            }
            const calendarId = await CalendarModel.isCalendarActiveAndAvailable();
            await SchoolarCycleModel.initCicleUpdateCalendar(calendarId);

            connection.commit();
            connection.release();
            resolve();
        } catch (error) {
            connection.rollback();
            connection.release();
            console.error(error);
            reject(error)
        }
    })
}

SchedulesModel.getTeacherSchedule = async (person_id) => {
    const connection = await db.getConnection();
    return new Promise(async(resolve, reject) => {
        try {
            const [result] = await connection.query(`SELECT h.Dia, h.Hora_Inicio, h.Hora_Fin, h.FK_Clase, m.Nombre FROM clase AS c JOIN profesor as p ON c.FK_Profesor = p.ID_Profesor JOIN persona as per ON p.FK_Persona = per.ID_Persona JOIN horario as h ON h.FK_Clase = c.ID_Clase JOIN materia as m ON m.ID_Materia = c.FK_Materia WHERE per.ID_Persona = "${person_id}" ORDER BY h.Dia`);
            connection.release();
            resolve(result);
        } catch (error) {
            connection.release();
            console.error(error);
            reject(error);
        }
    })
}

SchedulesModel.getStudentSchedule = async (person_id) => {
    const connection = await db.getConnection();
    return new Promise(async(resolve, reject) => {
        try {
            const [result] = await connection.query(`SELECT h.Dia, h.Hora_Inicio, h.Hora_Fin, h.FK_Clase, m.Nombre FROM persona AS p JOIN estudiante AS e ON e.FK_Persona = p.ID_Persona JOIN estudiante_clases AS ec ON ec.FK_Estudiante = e.ID_Estudiante JOIN clase as c ON c.ID_Clase = ec.FK_Clase JOIN materia as m ON m.ID_Materia = c.FK_Materia JOIN horario as h ON h.FK_Clase = c.ID_Clase WHERE p.ID_Persona = "${person_id}" ORDER BY h.Dia`);
            connection.release();
            resolve(result);
        } catch (error) {
            connection.release();
            console.error(error);
            reject(error);
        }
    }) 
}

module.exports = SchedulesModel;