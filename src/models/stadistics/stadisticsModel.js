const db = require('../../config/databaseConfig');
const StadisticsModel = {};

StadisticsModel.getTotalUsers = async() => {
    const connection = await db.getConnection();
    return new Promise(async (resolve, reject) => {
        try {
            const [result] = await connection.query('SELECT COUNT(*) as totalUsers FROM persona');
            connection.release();
            resolve(result[0].totalUsers);
        } catch (error) {
            connection.release();
            console.error(error);
            reject(error);
        }
    });
}

StadisticsModel.getTotalStudentToBe = async() => {
    const connection = await db.getConnection();
    return new Promise(async (resolve, reject) => {
        try {
            const [result] = await connection.query('SELECT COUNT(*) as totalStudenToBe FROM estudiante E LEFT JOIN aspirante_helper A ON E.ID_Estudiante = A.FK_Estudiante WHERE A.ID_Aspirante IS NOT NULL;');
            connection.release();
            resolve(result[0].totalStudenToBe);
        } catch (error) {
            connection.release();
            console.error(error);
            reject(error);
        }
    });
}

StadisticsModel.getTotalStudents = async() => {
    const connection = await db.getConnection();
    return new Promise(async (resolve, reject) => {
        try {
            const [result] = await connection.query('SELECT COUNT(*) as totalStudents FROM estudiante E LEFT JOIN aspirante_helper A ON E.ID_Estudiante = A.FK_Estudiante WHERE A.ID_Aspirante IS NULL;');
            connection.release();
            resolve(result[0].totalStudents);
        } catch (error) {
            connection.release();
            console.error(error);
            reject(error);
        }
    });
}


StadisticsModel.getTotalTeachers = async () => {
    const connection = await db.getConnection();
    return new Promise(async(resolve, reject) => {
        try {
            const [result] =  await connection.query('SELECT COUNT(*) as totalTeachers FROM persona WHERE Rol = "Profesor"');
            connection.release();
            resolve(result[0].totalTeachers);
        } catch (error) {
            connection.release();
            console.error(error);
            reject(error);
        }
    });
}

StadisticsModel.getTotalAdmins = async () => {
    const connection = await db.getConnection();
    return new Promise(async(resolve, reject) => {
        try {
            const [result] =  await connection.query('SELECT COUNT(*) as totalAdmins FROM persona WHERE Rol = "Administrativo"');
            connection.release();
            resolve(result[0].totalAdmins);
        } catch (error) {
            connection.release();
            console.error(error);
            reject(error);
        }
    });
}

StadisticsModel.getGenderStats = async () => {
    const connection = await db.getConnection();
    return new Promise(async(resolve, reject) => {
        try {
            const [resultMasc] =  await connection.query("SELECT COUNT(*) as 'Masculino' FROM persona WHERE Genero = 'Masculino'");
            const [resultFem] =  await connection.query("SELECT COUNT(*) as 'Femenino' FROM persona WHERE Genero = 'Femenino'");
            const [resultOther] =  await connection.query("SELECT COUNT(*) as 'Otro' FROM persona WHERE Genero = 'Otro'");
            connection.release();

            let genderStats =[
                {gender: 'Masculino', value: resultMasc[0].Masculino, color: '#1FC0C8'},
                {gender: 'Femenino', value: resultFem[0].Femenino, color: '#F55C7A'},
                {gender: 'Otro', value: resultOther[0].Otro, color: '#6941C6'}
            ]

            resolve(genderStats);
        } catch (error) {
            connection.release();
            console.error(error);
            reject(error);
        }
    });
}

module.exports = StadisticsModel;