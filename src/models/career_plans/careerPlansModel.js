const db = require('../../config/databaseConfig');
const CareerPlansModel = {};

CareerPlansModel.getValidateCareerPlans = async () => {
    const connection = await db.getConnection();
    return new Promise(async(resolve, reject) => {
        try {
            const [result] = await connection.query('CALL checkCareersPlans()');
            connection.release();

            resolve(result[0]);
        } catch (error) {
            connection.release();
            console.error(error);
            reject(error);
        }
    })
}

CareerPlansModel.createPlan = async (idCarrera, materias, previas) => {
    const connection = await db.getConnection();
    return new Promise(async(resolve, reject) => {
        try {

            connection.beginTransaction();

            await connection.query(`INSERT INTO carrera_plan_academico(FK_Carrera) VALUES ("${idCarrera}")`);
            const [newPlanCareerId] = await connection.query(`SELECT ID_Carrera_Plan_Academico FROM carrera_plan_academico WHERE FK_Carrera = "${idCarrera}" AND Active = TRUE ORDER BY Creado_En DESC LIMIT 1`);
            await connection.query(`CALL setOnlyOnePlanActive("${idCarrera}", "${newPlanCareerId[0].ID_Carrera_Plan_Academico}")`);

            for (let i = 0; i < Object.keys(materias).length; i++) {
                for (let j = 0; j < Object.keys(materias[i]).length; j++) {
                    const [insertSubj] = await connection.query(`INSERT INTO detalle_plan_academico(FK_Carrera_Plan_Academico, FK_Materia, Ciclo_A_Impartir, Creado_En) VALUES ("${newPlanCareerId[0].ID_Carrera_Plan_Academico}", "${materias[i][j].ID_Materia}", ${i}, NOW())`) ;

                    if(insertSubj.affectedRows === 0){
                        throw new Error('Ocurrio un error insertando las materias, por favor intentalo de nuevo.')
                    }
                }
            }

            if(previas.length > 0){
                for (let x = 0; x < previas.length; x++) {
                    const [updateSubj] = await connection.query(`UPDATE detalle_plan_academico SET Materia_Previa = "${previas[x].prevSubject}" WHERE FK_Carrera_Plan_Academico = "${newPlanCareerId[0].ID_Carrera_Plan_Academico}" AND FK_Materia = "${previas[x].subject}"`);

                    if(updateSubj.affectedRows === 0){
                        throw new Error('Ocurrio un error insertando las materias, por favor intentalo de nuevo.')
                    }
                }
            }

            connection.commit();
            connection.release();
            resolve(true);
        } catch (error) {
            connection.rollback();
            connection.release();
            console.error(error);
            reject(error);
        }
    })
}

CareerPlansModel.getPlanMinimalDetailsByCareers = async (careers) => {
    const connection = await db.getConnection();
    return new Promise(async(resolve, reject) => {
        try {
            const helper = [];

            for (let i = 0; i < careers.length; i++) {
                const [result] = await connection.query(`SELECT cpa.FK_Carrera, cpa.ID_Carrera_Plan_Academico, cpa.Creado_En, m.Nombre as 'Materia', m.Creditos, m.Horas_De_Clase FROM carrera_plan_academico as cpa, detalle_plan_academico as dpa, materia as m WHERE cpa.ID_Carrera_Plan_Academico = dpa.FK_Carrera_Plan_Academico AND dpa.FK_Materia = m.ID_Materia AND cpa.Active = TRUE AND cpa.FK_Carrera = "${careers[i].ID_Carrera}"`);

                if(result.length > 0){
                    helper.push(result);
                }
            }

            connection.release();
            resolve(helper);
        } catch (error) {
            connection.release();
            console.error(error);
            reject(error);
        }
    })
}

CareerPlansModel.getSubjectsPerCicle = async (career, cicle) => {
    const connection = await db.getConnection();
    return new Promise(async(resolve, reject) => {
        try {
            const [result] = await connection.query(`CALL obtener_materias_por_carrera_ciclo("${career}", ${cicle})`);
            connection.release();
            resolve(result[0]);

        } catch (error) {
            connection.release();
            console.error(error);
            reject(error);
        }
    })
}

module.exports = CareerPlansModel;