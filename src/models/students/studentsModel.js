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

module.exports = StudentModel;