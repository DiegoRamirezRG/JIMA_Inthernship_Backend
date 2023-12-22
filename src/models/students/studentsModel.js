const db = require('../../config/databaseConfig');
const StudentModel = {};

StudentModel.isStudentEnrolled = async (user_id) => {
    const connection = await db.getConnection();
    return new Promise(async (resolve, reject) => {
        try {

            const [result] = await connection.query(`SELECT EXISTS (SELECT 1 FROM aspirante_helper as aph, estudiante est, persona per WHERE aph.FK_Estudiante = est.ID_Estudiante AND per.ID_Persona = est.FK_Persona AND ID_Persona = "${user_id}") as aspirante`);

            connection.release();
            resolve(result[0].aspirante);
        } catch (error) {
            connection.release();
            console.error(error.message);
            reject(error);
        }
    })
}

StudentModel.isStudentEnlisted = async (user_id) => {
    const connection = await db.getConnection();
    return new Promise(async (resolve, reject) => {
        try {

            const [result] = await connection.query(`SELECT EXISTS (SELECT 1 FROM inscripciones as ins, estudiante est, persona per WHERE ins.FK_Estudiante = est.ID_Estudiante AND per.ID_Persona = est.FK_Persona AND ID_Persona = "${user_id}") as inscrito`);

            connection.release();
            resolve(result[0].inscrito);
        } catch (error) {
            connection.release();
            console.error(error.message);
            reject(error);
        }
    })
}

StudentModel.verifyIsStudent = async (student_id) => {
    const connection = await db.getConnection();
    return new Promise(async (resolve, reject) => {
        try {
            
            const [result] = await connection.query(`SELECT * FROM estudiante WHERE ID_Estudiante = "${student_id}"`);
            connection.release();

            if(result.length > 0){
                resolve('Exist');
            }else{
                reject(new Error('El usuario no es un estudiante'));
            }

        } catch (error) {
            connection.release();
            console.log(error.message);
            reject(error);
        }
    })
}

StudentModel.createStudentToBe = async (studentId, careerId) => {
    const connection = await db.getConnection();
    return new Promise( async(resolve, reject) => {
        try {
            const [result] = await connection.query(`INSERT INTO aspirante_helper(FK_Estudiante, FK_Carrera) VALUES ("${studentId}", "${careerId}")`);
            connection.release();

            if(result.affectedRows > 0){
                resolve('Register')
            }else{
                throw new Error('El usuario no se ha podido registrar como Aspirante');
            }
        } catch (error) {
            connection.release();
            console.log(error.message);
            reject(error);
        }
    })
}

StudentModel.getStudentToBeData = async (user_id) => {
    const connection = await db.getConnection();
    return new Promise(async (resolve, reject) => {
        try {
            const [result] = await connection.query(`SELECT asp.* FROM aspirante_helper asp, estudiante est, persona per WHERE asp.FK_Estudiante = est.ID_Estudiante AND est.FK_Persona = per.ID_Persona AND per.ID_Persona = "${user_id}"`);
            connection.release();
            resolve(result[0]);
        } catch (error) {
            connection.release();
            console.log(error.message);
            reject(error);
        }
    })
}

StudentModel.createCustomStudent = async (ID_Student, ID_Career, ID_Grado, ID_Grupo, ID_Turno) => {
    const connection = await db.getConnection();
    return new Promise(async (resolve, reject) => {
        try {
            
            connection.beginTransaction();
            let user_id;

            if(!user_id){
                const [person] = await connection.query(`SELECT p.ID_Persona as id FROM persona as p, estudiante as e WHERE e.FK_Persona = p.ID_Persona AND e.ID_Estudiante = "${ID_Student}"`);
                user_id = person[0].id;
            }

            const [result] = await connection.query(`INSERT INTO inscripciones(FK_Estudiante, FK_Carrera, FK_Grado, FK_Grupo, FK_Turno) VALUES("${ID_Student}", "${ID_Career}", "${ID_Grado}", "${ID_Grupo}", "${ID_Turno}")`);
            const [updatePersona] = await connection.query(`UPDATE persona SET Active = true WHERE ID_Persona = "${user_id}"`);

            console.log(result.affectedRows);
            console.log(`UPDATE persona SET Active = true WHERE ID_Persona = "${user_id}"`);

            if(result.affectedRows > 0 && updatePersona.affectedRows > 0){
                await connection.query('CALL insert_custom_enrolled_classes(?, ?, ?, ?, ?)', [
                    ID_Student,
                    ID_Career,
                    ID_Grado,
                    ID_Grupo,
                    ID_Turno
                ]);

                connection.commit();
                connection.release();
                resolve();
            }else{
                throw new Error('Error al ingresar al estudiante a una clase');
            }
        } catch (error) {
            connection.rollback();
            connection.release();
            console.error(error.message);
            reject(error);
        }
    })
}

StudentModel.getEnrolledStudentData = async (user_id) => {
    const connection = await db.getConnection();
    return new Promise(async(resolve, reject) => {
        try {
            
            const [result] = await connection.query(`SELECT ins.* FROM inscripciones AS ins, estudiante AS est, persona AS per WHERE ins.FK_Estudiante = est.ID_Estudiante AND per.ID_Persona = est.FK_Persona AND per.ID_Persona = "${user_id}" ORDER BY Creado_En DESC LIMIT 1`);
            connection.release();
            resolve(result[0]);

        } catch (error) {
            connection.release();
            console.error(error.message);
            reject(error);
        }
    })
}

StudentModel.getStudentId = async (user_id) => {
    const connection = await db.getConnection();
    return new Promise(async (resolve, reject) => {
        try {
            const [result] = await connection.query(`SELECT est.ID_Estudiante as student_id FROM estudiante est, persona as per WHERE per.ID_Persona = est.FK_Persona AND per.ID_Persona = "${user_id}"`);
            connection.release();
            
            resolve(result[0].student_id);
        } catch (error) {
            connection.release();
            console.error(error.message);
            reject(error);
        }
    })
}

StudentModel.deleteAspiranteRegister = async(student_id) => {
    const connection = await db.getConnection();
    return new Promise(async (resolve, reject) => {
        try {
            connection.beginTransaction();
            const [result] = await connection.query(`DELETE FROM aspirante_helper WHERE FK_Estudiante = "${student_id}"`);

            if(result.affectedRows > 0){
                connection.commit();
                connection.release();
                resolve();
            }else{
                throw new Error('Error al eliminar el registro del Aspirante');
            }
        } catch (error) {
            connection.rollback();
            connection.release();
            console.error(error.message);
            reject(error);
        }
    })
}

StudentModel.getActiveEnrolled = async(student_id) => {
    const connection = await db.getConnection();
    return new Promise(async(resolve, reject) => {
        try {
            
            const [result] = await connection.query(`SELECT c.Nombre, gra.Numero as Grado, gru.Indicador as Grupo, tur.Nombre as Turno, ins.Active, ins.Pagado FROM inscripciones AS ins JOIN carrera AS c ON c.ID_Carrera = ins.FK_Carrera JOIN grados AS gra ON gra.ID_Grado = ins.FK_Grado JOIN grupos AS gru ON gru.ID_Grupo = ins.FK_Grupo JOIN turnos AS tur ON tur.ID_Turno = ins.FK_Turno JOIN calendario AS cal ON ins.Creado_En BETWEEN cal.Inicio AND cal.Fin WHERE ins.FK_Estudiante = "${student_id}" ORDER BY ins.Creado_En DESC LIMIT 1`);
            connection.release();
            resolve(result[0]);

        } catch (error) {
            connection.release();
            console.error(error.message);
            reject(error);
        }
    })
}

StudentModel.getLastCycleStudents = async() => {
    const connection = await db.getConnection();
    return new Promise(async(resolve, reject) => {
        try {
            const [result] = await connection.query(`WITH last_valid_inscriptions AS (
                SELECT
                    i.*,
                    ROW_NUMBER() OVER (PARTITION BY i.FK_Estudiante ORDER BY i.Actualizado_EN DESC) AS RowNum
                FROM
                    inscripciones AS i
                WHERE
                    i.Active = FALSE
            )
            SELECT
                i.ID_Inscripciones,
                i.FK_Carrera,
                i.FK_Grado,
                i.FK_Grupo,
                i.FK_Turno,
                e.ID_Estudiante,
                p.ID_Persona,
                p.Nombre,
                p.Apellido_Paterno,
                p.Apellido_Materno,
                c.ID_Carrera,
                c.Nombre AS Carrera,
                c.Numero_De_Ciclos,
                c.Duracion_Mensual_De_Ciclos,
                c.Descripcion,
                gru.ID_Grupo,
                gru.Indicador,
                gra.ID_Grado,
                gra.Numero,
                t.ID_Turno,
                t.Nombre as Turno
            FROM last_valid_inscriptions AS i
            JOIN estudiante AS e ON e.ID_Estudiante = i.FK_Estudiante
            JOIN persona AS p ON p.ID_Persona = e.FK_Persona
            JOIN carrera AS c ON i.FK_Carrera = c.ID_Carrera
            JOIN grupos AS gru ON i.FK_Grupo = gru.ID_Grupo
            JOIN grados AS gra ON i.FK_Grado = gra.ID_Grado
            JOIN turnos AS t ON i.FK_Turno = t.ID_Turno
            WHERE i.Active = FALSE
            AND i.RowNum = 1
            ORDER BY
            FK_Turno,
            FK_Carrera,
            FK_Grado,
            FK_Grupo`);

            connection.release();
            resolve(result);
        } catch (error) {
            connection.release();
            console.error(error.message);
            reject(error);
        }
    })
}

StudentModel.getStudentsToBe = async () => {
    const connection = await db.getConnection();
    return new Promise(async(resolve, reject) => {
        try {
            
            const [result] = await connection.query('SELECT ap.ID_Aspirante, e.ID_Estudiante, c.ID_Carrera, p.* FROM aspirante_helper as ap, estudiante as e, carrera as c, persona as p WHERE ap.FK_Estudiante = e.ID_Estudiante AND e.FK_Persona = p.ID_Persona AND ap.FK_Carrera = c.ID_Carrera ORDER BY c.ID_Carrera');
            connection.release();
            resolve(result);

        } catch (error) {
            connection.release();
            console.error(error.message);
            reject(error);
        }
    })
}

StudentModel.getClassesById = async (person_id) => {
    const connection = await db.getConnection();
    return new Promise(async (resolve, reject) => {
        try {
            const [result] = await connection.query(`SELECT c.* FROM estudiante_clases AS ec JOIN estudiante AS e ON e.ID_Estudiante = ec.FK_Estudiante JOIN persona AS p ON p.ID_Persona = e.FK_Persona JOIN clase AS c ON ec.FK_Clase = c.ID_Clase JOIN materia AS m ON c.FK_Materia = m.ID_Materia WHERE p.ID_Persona = "${person_id}"`);
            connection.release();
            resolve(result);

        } catch (error) {
            connection.release();
            console.error(error.message);
            reject(error);
        }
    })
}

StudentModel.getStudentIdByPersonId = async(person_id) => {
    const connection = await db.getConnection();
    return new Promise(async( resolve, reject ) => {
        try {
            const [result] = await connection.query(`SELECT ID_Estudiante FROM estudiante WHERE FK_Persona = "${person_id}"`);
            connection.release();
            resolve(result[0].ID_Estudiante);
        } catch (error) {
            connection.release();
            console.error(error.message);
            reject(error);
        }
    })
}

StudentModel.getTodoAssigmentes = async (student_id) => {
    const connection = await db.getConnection();
    return new Promise(async (resolve, reject) => {
        try {
            const [result] = await connection.query(`SELECT DISTINCT a.*, m.Nombre, c.FK_Profesor
            FROM estudiante_clases ec
            JOIN clase c ON ec.FK_Clase = c.ID_Clase
            JOIN actividad a ON c.ID_Clase = a.FK_Clase
            JOIN materia m ON c.FK_Materia = m.ID_Materia
            LEFT JOIN entregas e ON a.ID_Actividad = e.FK_Actividad AND e.FK_Estudiante = ec.FK_Estudiante
            WHERE ec.FK_Estudiante = "${student_id}"
            AND (e.ID_Entregas IS NULL AND (a.Fecha_De_Entrega >= CURDATE() OR a.Fecha_De_Entrega IS NULL OR a.Acepta_Despues = 1));`);


            connection.release()
            resolve(result);
        } catch (error) {
            connection.release();
            console.error(error.message);
            reject(error);
        }
    })
}

StudentModel.getEnrolledStudentInformation = async (student_id) => {
    const connection = await db.getConnection();
    return new Promise(async (resolve, reject) => {
        try {
            const [result] = await connection.query(`SELECT gra.Numero, gru.Indicador, tur.Nombre, tur.Hora_Inicio, tur.Hora_Fin, car.Nombre as Carrera, car.Numero_De_Ciclos FROM 
            inscripciones AS i 
            JOIN grados AS gra ON i.FK_Grado = gra.ID_Grado
            JOIN carrera AS car ON i.FK_Carrera = car.ID_Carrera
            JOIN grupos AS gru ON i.FK_Grupo = gru.ID_Grupo
            JOIN turnos AS tur ON i.FK_Turno = tur.ID_Turno
            WHERE i.FK_Estudiante = ?
            ORDER BY i.Creado_EN DESC LIMIT 1`, [ student_id ]);
            
            connection.release();
            resolve(result[0]);
        } catch (error) {
            connection.release();
            console.error(error.message);
            reject(error);
        }
    })
}

StudentModel.getCurrentClasses = async (student_id) => {
    const connection = await db.getConnection();
    return new Promise(async(resolve, reject) => {
        try {
            const [result] = await connection.query('CALL getStudentActiveClasses(?)', [ student_id ]);
            connection.release();
            resolve(result[0]);
        } catch (error) {
            connection.release();
            console.error(error.message);
            reject(error);
        }
    })
}

StudentModel.getAllClasses = async (student_id) => {
    const connection = await db.getConnection();
    return new Promise(async(resolve, reject) => {
        try {
            const [result] = await connection.query('CALL getStudentAllClasses(?)', [ student_id ]);
            connection.release();
            resolve(result[0]);
        } catch (error) {
            connection.release();
            console.error(error.message);
            reject(error);
        }
    })
}

StudentModel.getExtraGeade = async (class_id, student_id) => {
    const connection = await db.getConnection();
    return new Promise(async(resolve, reject) => {
        try {
            const [result] = await connection.query('CALL get_unit_avg_no_unit(?, ?)', [ class_id, student_id ]);
            connection.release();
            resolve(result[0]);
        } catch (error) {
            connection.release();
            console.error(error.message);
            reject(error);
        }
    })
}

StudentModel.getUnitAvg = async (class_id, unit_id, student_id) => {
    const connection = await db.getConnection();
    return new Promise(async(resolve, reject) => {
        try {
            const [result] = await connection.query('CALL get_unit_avg(?, ?, ?)', [ class_id, unit_id, student_id ]);
            connection.release();
            resolve(result[0]);
        } catch (error) {
            connection.release();
            console.error(error.message);
            reject(error);
        }
    })
}

StudentModel.getAllStudents = async () => {
    const connection = await db.getConnection();
    return new Promise(async (resolve, reject) => {
        try {
            const [result] = await connection.query(`SELECT e.ID_Estudiante, p.ID_Persona, CONCAT(p.Nombre, ' ', p.Apellido_Paterno, ' ',p.Apellido_Materno) as Nombre_Estudiante, p.Active, p.Imagen  FROM estudiante e JOIN persona p ON p.ID_Persona = e.FK_Persona`);
            connection.release();
            resolve(result);
        } catch (error) {
            connection.release();
            console.error(error);
            reject(error);
        }
    })
}

module.exports = StudentModel;