const db = require('../../config/databaseConfig');
const SchoolInfoModel = require('../school_info/school_infoModel');
const SchoolarCycleModel = {};

SchoolarCycleModel.getCycleStat = async (id_calendario) => {
    const connection = await db.getConnection();
    return new Promise(async(resolve, reject) => {
        try {
            const [result] = await connection.query(`SELECT Ciclo_Iniciado, Ciclo_Conf_Term FROM handler_ciclo_escolar WHERE FK_Calendario = "${id_calendario}"`);
            connection.release();
            resolve(result[0]);
        } catch (error) {
            console.error(error);
            connection.release();
            reject(error);
        }
    })
}

SchoolarCycleModel.createInscriptionGroup = async(careerId, students, shifts) => {
    const connection = await db.getConnection();
    return new Promise(async(resolve, reject) => {
        try {
            connection.beginTransaction();
            let groupsHelper = [];

            const [grade_id] = await connection.query(`SELECT ObtenerIDGrado(1) AS ID_Grado`);

            for (let x = 0; x < students.length; x++) {
                const [groupId] = await connection.query(`SELECT CrearGrupoAutomatico(${x + 1}) as groupId`);
                groupsHelper.push(groupId[0].groupId);
            }

            for (let i = 0; i < students.length; i++) {
                for (let j = 0; j < Object.values(students[i][0]).length; j++) {
                    const [actions] = await connection.query(`DELETE FROM aspirante_helper WHERE FK_Estudiante = "${Object.values(students[i][0])[j]}"`);

                    if(actions.affectedRows <= 0){
                        throw new Error('Ha ocurrido un error al actualizar de aspirante a estudiante');
                    }
                }
            }

            for (let i = 0; i < students.length; i++) {
                for (let j = 0; j < Object.values(students[i][0]).length; j++) {
                    const [inscript] = await connection.query(`INSERT INTO inscripciones(FK_Estudiante, FK_Carrera, FK_Grado, FK_Grupo, FK_Turno) VALUES("${Object.values(students[i][0])[j]}", "${careerId}", "${grade_id[0].ID_Grado}", "${groupsHelper[i]}", "${shifts[i]}")`);
                    const [updates] = await connection.query(`UPDATE persona as a JOIN estudiante AS e ON e.FK_Persona = a.ID_Persona SET Active = TRUE WHERE e.ID_Estudiante = "${Object.values(students[i][0])[j]}"`);

                    if(inscript.affectedRows <= 0 || updates.affectedRows <= 0){
                        throw new Error('Ha ocurrido un error al inscribir al estudiante');
                    }
                }
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

SchoolarCycleModel.initCicleUpdateCalendar = async (calendar_id) => {
    const connection = await db.getConnection();
    return new Promise(async(resolve, reject) => {
        try {
            const [result] = await connection.query(`UPDATE handler_ciclo_escolar SET Ciclo_Iniciado = TRUE AND Ciclo_Conf_Term = TRUE WHERE FK_Calendario = "${calendar_id}"`);
            if(result.affectedRows > 0){
                connection.release();
                resolve();
            }else{
                throw new Error('Ha ocurrido un error al iniciar el ciclo');
            }
        } catch (error) {
            connection.release();
            console.error(error);
            reject(error);
        }
    })
}

module.exports = SchoolarCycleModel;