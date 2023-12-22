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
            const [result] = await connection.query(`SELECT h.Dia, h.Hora_Inicio, h.Hora_Fin, h.FK_Clase, m.Nombre FROM clase AS c 
            JOIN profesor as p ON c.FK_Profesor = p.ID_Profesor 
            JOIN persona as per ON p.FK_Persona = per.ID_Persona 
            JOIN horario as h ON h.FK_Clase = c.ID_Clase 
            JOIN materia as m ON m.ID_Materia = c.FK_Materia 
            WHERE per.ID_Persona = "${person_id}"
            AND c.Active = TRUE
            ORDER BY h.Dia`);
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
            const [result] = await connection.query(`SELECT h.Dia, h.Hora_Inicio, h.Hora_Fin, h.FK_Clase, m.Nombre FROM persona AS p 
            JOIN estudiante AS e ON e.FK_Persona = p.ID_Persona 
            JOIN estudiante_clases AS ec ON ec.FK_Estudiante = e.ID_Estudiante 
            JOIN clase as c ON c.ID_Clase = ec.FK_Clase JOIN materia as m ON m.ID_Materia = c.FK_Materia 
            JOIN horario as h ON h.FK_Clase = c.ID_Clase 
            WHERE p.ID_Persona = "${person_id}" 
            AND c.Active = TRUE
            ORDER BY h.Dia`);
            connection.release();
            resolve(result);
        } catch (error) {
            connection.release();
            console.error(error);
            reject(error);
        }
    }) 
}

SchedulesModel.getShiftData = async (shift_id) => {
    const connection = await db.getConnection();
    return new Promise(async(resolve, reject) => {
        try {
            const [result] = await connection.query('SELECT Hora_Inicio, Hora_Fin FROM turnos WHERE ID_Turno = ?', [ shift_id ]);
            connection.release();
            resolve(result[0]);
        } catch (error) {
            connection.release();
            console.error(error);
            reject(error);
        }
    })
}

SchedulesModel.createReinsSchedule = async (groups) => {
    const connection = await db.getConnection();
    return new Promise(async(resolve, reject) => {
        try {
            connection.beginTransaction();

            for (let i = 0; i < Object.values(groups).length; i++) {
                const grade = await connection.query('CALL getGradeId(?)', [ groups[i].gradeNumber ]);

                for (let j = 0; j < Object.values(groups[i].students_ids).length; j++) {
                    const reinscriptionObj = await connection.query(`INSERT INTO inscripciones(FK_Estudiante, FK_Carrera, FK_Grado, FK_Grupo, FK_Turno) VALUES (?, ?, ?, ?, ?)`, [
                        groups[i].students_ids[j],
                        groups[i].id_Career,
                        grade[0][0][0].ID_Grado,
                        groups[i].id_Grupo,
                        groups[i].id_Turno
                    ]);

                    if(reinscriptionObj[0].affectedRows <= 0){
                        throw new Error('Ha ocurrido un error al realzizar las inscripciones');
                    }
                }


                for (let n = 0; n < Object.values(groups[i].class_teacher).length; n++) {
                    await connection.query('INSERT INTO clase(FK_Materia, FK_Profesor) VALUES (?, ?)', [ groups[i].class_teacher[n].FK_Materia, groups[i].class_teacher[n].FK_Profesor ]);
                    const [insertedClass] = await connection.query('SELECT ID_Clase FROM clase WHERE FK_Materia = ? AND FK_Profesor = ? AND Active = TRUE ORDER BY Creado_En DESC LIMIT 1', [ groups[i].class_teacher[n].FK_Materia, groups[i].class_teacher[n].FK_Profesor ])

                    if(insertedClass.affectedRows <= 0){
                        throw new Error('Ha ocurrido un error al crear la clase');
                    }


                    for (let o = 0; o < Object.values(groups[i].class_teacher[n].schedule).length; o++) {
                        const [scheduleObj] = await connection.query('INSERT INTO horario(Dia, Hora_Inicio, Hora_Fin, FK_Clase) VALUES (?, STR_TO_DATE(?, "%H:%i"), STR_TO_DATE(?, "%H:%i"), ?)', [ 
                            groups[i].class_teacher[n].schedule[o].Dia,
                            groups[i].class_teacher[n].schedule[o].Hora_Inicio,
                            groups[i].class_teacher[n].schedule[o].Hora_Fin,
                            insertedClass[0].ID_Clase
                        ]);

                        if(scheduleObj.affectedRows <= 0){
                            throw new Error('Ha ocurrido un error al ingresar los horarios');
                        }
                    }

                    for (let k = 0; k < Object.values(groups[i].students_ids).length; k++) {
                        const [insertedStudent] = await connection.query('INSERT INTO estudiante_clases(FK_Estudiante, FK_Clase) VALUES (?, ?)', [ groups[i].students_ids[k], insertedClass[0].ID_Clase ]);

                        if(insertedStudent <= 0){
                            throw new Error('Ha ocurrido un error al ingresar los horarios');
                        }
                    }
                }
            }

            const calendarId = await CalendarModel.isCalendarActiveAndAvailable();
            await SchoolarCycleModel.initCicleUpdateCalendar(calendarId);

            connection.commit();
            connection.release()
            resolve();
        } catch (error) {
            connection.rollback();
            connection.release();
            console.error(error);
            reject(error);
        }
    });
}

module.exports = SchedulesModel;