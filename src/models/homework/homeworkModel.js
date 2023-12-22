const db = require('../../config/databaseConfig');
const cheerio = require('cheerio');
const moment = require('moment');

const HomeworkModel = {};

HomeworkModel.getStudentIdByPersonId = async(personId) => {
    const connection = await db.getConnection();
    return new Promise(async(resolve, reject) => {
        try {
            const [result] = await connection.query(`SELECT ID_Estudiante FROM estudiante WHERE FK_Persona = "${personId}"`);
            connection.release();
            resolve(result[0].ID_Estudiante);
        } catch (error) {
            connection.release();
            console.error(error);
            reject(error);
        }
    })
}

HomeworkModel.getHomeWorksInfo = async(claseId) => {
    const connection = await db.getConnection();
    return new Promise(async(resolve, reject) => {
        try {
            const [result] = await connection.query(`SELECT * FROM actividad WHERE FK_Clase = "${claseId}"`);
            connection.release();
            resolve(result);
        } catch (error) {
            connection.release();
            console.error(error);
            reject(error);
        }
    })
}

HomeworkModel.createRubric = async (person_id, rubCriterias) => {
    const connection = await db.getConnection();
    return new Promise(async(resolve, reject) => {
        try {
            connection.beginTransaction();

            await connection.query(`INSERT INTO rubrica(Creado_Por) VALUES ("${person_id}")`);
            const [rubricResult] = await connection.query(`SELECT ID_Rubrica FROM rubrica WHERE Creado_Por ="${person_id}" ORDER BY Creado_En DESC LIMIT 1`);

            for (let i = 0; i < rubCriterias.length; i++) {
                const [result] = await connection.query(`INSERT INTO detalle_rubrica(FK_Rubrica, Nombre, Descripcion, Valor) VALUES ("${rubricResult[0].ID_Rubrica}", "${rubCriterias[i].Nombre}", ${rubCriterias[i].Descripcion == "" ? null : `"${rubCriterias[i].Descripcion}"`}, ${parseInt(rubCriterias[i].Valor)})`);
                if(!(result.affectedRows > 0)){
                    throw new Error('Ocurrio un error registrando los detalles de la rubrica');
                }
            }

            connection.commit();
            connection.release();
            resolve(rubricResult[0].ID_Rubrica);
        } catch (error) {
            connection.rollback();
            connection.release();
            console.error(error);
            reject(error);
        }
    })
}

HomeworkModel.getAllRubricsByPersonId = async(person_id) => {
    const connection = await db.getConnection();
    return new Promise(async(resolve, reject) => {
        try {
            const [result] = await connection.query(`SELECT * FROM rubrica WHERE Creado_Por = "${person_id}"`);
            connection.release();
            resolve(result);
        } catch (error) {
            connection.release();
            console.error(error);
            reject(error);
        }
    })
}

HomeworkModel.getCriteriaByRubricId = async (rubric_id) => {
    const connection = await db.getConnection();
    return new Promise(async(resolve, reject) => {
        try {
            const [result] = await connection.query(`SELECT * FROM detalle_rubrica WHERE FK_Rubrica = "${rubric_id}"`);
            connection.release()
            resolve(result);
        } catch (error) {
            connection.release();
            console.error(error);
            reject(error);
        }
    })
}

HomeworkModel.createUnit = async (title, classId) => {
    const connection = await db.getConnection();
    return new Promise(async(resolve, reject) => {
        try {
            connection.beginTransaction();
            const [result] = await connection.query(`INSERT INTO unidad(FK_Clase, Nombre) VALUES ("${classId}", "${title}")`);
            
            if(result.affectedRows > 0){
                connection.commit();
                connection.release();
                resolve();
            }else{
                throw new Error('Ha ocurrido un error al crear la unidad');
            }
        } catch (error) {
            connection.rollback();
            connection.release();
            console.error(error);
            reject(error);
        }
    })
}

HomeworkModel.createUnitWithRubric = async (title, classID, rubricId) => {
    const connection = await db.getConnection();
    return new Promise(async(resolve, reject) => {
        try {
            connection.beginTransaction();

            const [result] = await connection.query(`INSERT INTO unidad(FK_Clase, Nombre, FK_Rubrica) VALUES ("${classID}", "${title}", "${rubricId}")`);
            if(result.affectedRows > 0){
                connection.commit();
                connection.release();
                resolve();
            }else{
                throw new Error('Ha ocurrido un error al crear la unidad');
            }

        } catch (error) {
            connection.rollback();
            connection.release();
            console.error(error);
            reject(error);
        }
    })
}

HomeworkModel.getUnitsByClassId = async(class_id) => {
    const connection = await db.getConnection();
    return new Promise(async(resolve, reject) => {
        try {
            const [result] = await connection.query(`SELECT * FROM unidad WHERE FK_Clase = "${class_id}"`);
            connection.release();
            resolve(result);
        } catch (error) {
            connection.release();
            console.error(error);
            reject(error);
        }
    })
}

HomeworkModel.createWorkAssigment = async (Titulo, Descripcion, Fecha_De_Entrega, FK_Clase, FK_Rubrica, Fk_Unidad, Alumnos_Actividad, Requiere_Anexos, Acepta_Despues, Calificable) => {
    const connection = await db.getConnection();
    return new Promise(async(resolve, reject) => {
        try {
            connection.beginTransaction();

            const [studentList] = await connection.query(`SELECT FK_Estudiante as total FROM estudiante_clases WHERE FK_Clase = "${FK_Clase}"`);
            console.table(studentList);

            await connection.query(`INSERT INTO actividad(Titulo, FK_Clase) VALUES ("${Titulo}", "${FK_Clase}")`);
            const [insertedActividdad] = await connection.query(`SELECT ID_Actividad FROM actividad WHERE Titulo = "${Titulo}" AND FK_Clase = "${FK_Clase}" ORDER BY Creado_En DESC LIMIT 1`);

            const desc = cheerio.load(Descripcion);
            if(desc.text().trim() != ''){
                await connection.query(`UPDATE actividad SET Descripcion = "${Descripcion}" WHERE ID_Actividad = "${insertedActividdad[0].ID_Actividad}"`);
            }

            if(Requiere_Anexos){
                await connection.query(`UPDATE actividad SET Requiere_Anexos = TRUE WHERE ID_Actividad = "${insertedActividdad[0].ID_Actividad}"`);

                if(Fecha_De_Entrega != '' && moment(Fecha_De_Entrega, 'YYYY-MM-DD HH:mm:ss', true).isValid()){
                    await connection.query(`UPDATE actividad SET Fecha_De_Entrega = "${Fecha_De_Entrega}" WHERE ID_Actividad = "${insertedActividdad[0].ID_Actividad}"`);
                }

                if(Acepta_Despues){
                    await connection.query(`UPDATE actividad SET Acepta_Despues = TRUE WHERE ID_Actividad = "${insertedActividdad[0].ID_Actividad}"`);
                }
            }

            if(Calificable){
                await connection.query(`UPDATE actividad SET Calificable = TRUE WHERE ID_Actividad = "${insertedActividdad[0].ID_Actividad}"`);

                if(FK_Rubrica != ''){
                    await connection.query(`UPDATE actividad SET FK_Rubrica = "${FK_Rubrica}" WHERE ID_Actividad = "${insertedActividdad[0].ID_Actividad}"`);
                }
            }

            if(Fk_Unidad != ''){
                await connection.query(`UPDATE actividad SET Fk_Unidad = "${Fk_Unidad}" WHERE ID_Actividad = "${insertedActividdad[0].ID_Actividad}"`);
            }

            if(Alumnos_Actividad.length > 0 && Alumnos_Actividad.length < studentList.length){
                const studentToInsert = JSON.stringify(Alumnos_Actividad);
                console.log(studentToInsert);

                await connection.query(`UPDATE actividad SET Alumnos_Actividad = '${studentToInsert}' WHERE ID_Actividad = "${insertedActividdad[0].ID_Actividad}"`);
            }else{
                const studentsIds = JSON.stringify(studentList.map((student) => {
                    return student.total;
                }))

                console.log(studentsIds);
                await connection.query(`UPDATE actividad SET Alumnos_Actividad = '${studentsIds}' WHERE ID_Actividad = "${insertedActividdad[0].ID_Actividad}"`);
            }

            connection.commit();
            connection.release();
            resolve(insertedActividdad[0].ID_Actividad);

        } catch (error) {
            connection.rollback();
            connection.release();
            console.error(error);
            reject(error);
        }
    })
}

HomeworkModel.createAssignments = async (work_id, filename) => {
    const connection = await db.getConnection();
    return new Promise(async (resolve, reject) => {
        try {
            const [result] = await connection.query(`INSERT INTO actividad_anexos (FK_Actividad, Nombre_Del_Archivo) VALUES("${work_id}", "${filename}")`);

            if(result.affectedRows > 0){
                connection.release();
                resolve();
            }else{
                throw new Error('Ha ocurrido un error al insertar los archivos adjuntos');
            }
        } catch (error) {
            connection.release();
            console.error(error);
            reject(error);
        }
    })
}

HomeworkModel.getAllAssigmentsByClassId = async (class_id) => {
    const connection = await db.getConnection();
    return new Promise(async(resolve, reject) => {
        try {
            const [result] = await connection.query(`SELECT a.*, CASE WHEN COUNT(e.ID_Entregas) > 0 THEN JSON_ARRAYAGG(e.ID_Entregas) ELSE null END AS Entregas FROM actividad as a LEFT JOIN entregas as e ON e.FK_Actividad = a.ID_Actividad WHERE FK_Clase = "${class_id}" GROUP BY a.ID_Actividad`);
            connection.release();
            resolve(result);
        } catch (error) {
            connection.release();
            console.error(error);
            reject(error);
        }
    })
}

HomeworkModel.getAttachedFilesByAssigment = async (assign_id) => {
    const connection = await db.getConnection();
    return new Promise(async (resolve, reject) => {
        try {
            const [result] = await connection.query(`SELECT * FROM actividad_anexos WHERE FK_Actividad = "${assign_id}"`);
            connection.release();
            resolve(result);
        } catch (error) {
            connection.release();
            console.error(error);
            reject(error);
        }
    })
}

HomeworkModel.getStudentWorkStatus = async (assign_id, person_id) => {
    const connection = await db.getConnection();
    return new Promise(async (resolve, reject) => {
        try {
            const [result] = await connection.query(`CALL obtenerEstadoTareaEstudiante("${assign_id}", "${person_id}")`);
            console.log(typeof(result[0]));
            console.log(result[0][0].ExisteRegistro);
            connection.release();

            if(result[0][0].ExisteRegistro == false){
                resolve(false);
            }else{
                resolve(...result[0]);
            }
        } catch (error) {
            connection.release();
            console.error(error);
            reject(error);
        }
    })
}

HomeworkModel.turnInStudentWork = async ( FK_Actividad, ID_Persona, Archivos ) => {
    const connection = await db.getConnection();
    return new Promise(async(resolve, reject) => {
        try {
            connection.beginTransaction();

            const [result] = await connection.query(`SELECT ID_Estudiante FROM estudiante WHERE FK_Persona = "${ID_Persona}"`);

            await connection.query(`INSERT INTO entregas (FK_Actividad, FK_Estudiante) VALUES ("${FK_Actividad}", "${result[0].ID_Estudiante}")`);
            const [insertedActividdad] = await connection.query(`SELECT ID_Entregas FROM entregas WHERE FK_Actividad = "${FK_Actividad}" AND FK_Estudiante = "${result[0].ID_Estudiante}" ORDER BY Creado_En DESC LIMIT 1`);

            console.log(insertedActividdad[0].ID_Entregas);

            if(Archivos && Archivos.length > 0){
                const studentToInsert = JSON.stringify(Archivos);

                await connection.query(`UPDATE entregas SET Anexos = '${studentToInsert}' WHERE FK_Actividad = "${FK_Actividad}" AND FK_Estudiante = "${result[0].ID_Estudiante}"`);
            }

            connection.commit();
            connection.release();
            resolve();
        } catch (error) {
            connection.rollback();
            connection.release();
            console.error(error);
            reject(error);
        }
    })
}

HomeworkModel.getAssigmentStatus = async (assigment, person_id) => {
    const connection = await db.getConnection();
    return new Promise(async (resolve, reject) => {
        try {
            const [result] = await connection.query(`SELECT e.* FROM entregas AS e JOIN estudiante AS es ON es.ID_Estudiante = e.FK_Estudiante JOIN persona AS p on p.ID_Persona = es.FK_Persona WHERE FK_Actividad = "${assigment}" AND p.ID_Persona = "${person_id}"`);
            connection.release();
            resolve(result);
        } catch (error) {
            connection.release();
            console.error(error);
            reject();
        }
    })
}

HomeworkModel.getStudentGradesByClass = async ( class_id, person ) => {
    const connection = await db.getConnection();
    return new Promise(async(resolve, reject) => {
        try {
            
            const [result] = await connection.query(`SELECT e.* FROM entregas AS e
            JOIN estudiante AS es ON es.ID_Estudiante = e.FK_Estudiante
            JOIN persona AS p on p.ID_Persona = es.FK_Persona
            JOIN actividad AS a ON e.FK_Actividad = a.ID_Actividad
            JOIN clase as c ON c.ID_Clase = a.FK_Clase
            AND c.ID_Clase = "${class_id}"
            AND p.ID_Persona = "${person}"`);

            connection.release()
            resolve(result);

        } catch (error) {
            connection.release();
            console.error(error);
            reject(error);
        }
    })
}

module.exports = HomeworkModel;
