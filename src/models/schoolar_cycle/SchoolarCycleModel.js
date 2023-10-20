const db = require('../../config/databaseConfig');
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

module.exports = SchoolarCycleModel;