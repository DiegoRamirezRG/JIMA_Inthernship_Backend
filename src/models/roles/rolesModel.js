const db = require('../../config/databaseConfig');
const RolesModel = {}

RolesModel.getInfoByUserId = async(idUser) => {
    const connection = await db.getConnection();
    
    return new Promise(async(resolve, reject) => {
        try {
            
            const [user] = await connection.query(`SELECT Rol FROM persona WHERE ID_Persona = "${idUser}"`);

            switch(user[0].Rol){
                case 'Administrativo':
                    const [admin] = await connection.query(`SELECT ID_Administrativos, Codigo_De_Administrativo, NSS, Fecha_De_Contratacion, URL FROM administrativos WHERE FK_Persona = "${idUser}"`);
                    connection.release();
                    admin[0]["FK_Persona"] = idUser;
                    resolve(admin[0]);
                    break;
                case 'Profesor':
                    const [teacher] = await connection.query(`SELECT ID_Profesor, Codigo_De_Profesor, NSS, Fecha_De_Contratacion, URL FROM profesor WHERE FK_Persona = "${idUser}"`);
                    connection.release();
                    teacher[0]["FK_Persona"] = idUser;
                    resolve(teacher[0]);
                    break;
                case 'Estudiante':
                    const [student] = await connection.query(`SELECT ID_Estudiante, Matricula, URL, Titulado FROM estudiante WHERE FK_Persona = "${idUser}"`);
                    connection.release();
                    student[0]["FK_Persona"] = idUser;
                    resolve(student[0]);
                    break;
                case 'Padre':
                    //Hacer lo de padre
                    connection.release();
                    resolve('No adaptado')
                    break;
                default:
                    connection.release();
                    reject(new Error('Hubo un error al resolver el Rol'));
                    break;
            }
        } catch (error) {
            connection.release();
            console.log(error);
            reject(error);
        }
    })
}


module.exports = RolesModel;