
const db = require('../../config/databaseConfig');
const path = require('path');
const crypto = require('crypto');
const { format } = require('date-fns');

const UsersHelpers = require('../../utils/usersHelpers/userHelpers');

const UsersModel = {};

UsersModel.getUsers = async (where, offset, order_by) => {

    const connection = await db.getConnection();

    return new Promise(async (resolve, reject) => {
        try {
            const [users] = await connection.query(`SELECT ID_Persona, Nombre, Apellido_Paterno, Apellido_Materno, Rol, Active, Imagen FROM persona${where != "" ? ' WHERE '+where+' ': ' '}${order_by != "" ? 'ORDER BY '+order_by+' ' : ' '}LIMIT 10 OFFSET ${offset}`);
            connection.release();

            resolve(users);
        } catch (error) {
            connection.release();
            reject(error);
        }
    })
}

UsersModel.getPagination = async(where) => {
    const connection = await db.getConnection();
    return new Promise(async (resolve, reject) => {
        try {
            const [pagination] = await connection.query(`SELECT COUNT(*) as Pag FROM persona${where != "" ? ' WHERE '+where+' ': ' '}`);
            connection.release();

            const pag = Math.ceil(pagination[0].Pag / 10);
            resolve(pag);
        } catch (error) {
            connection.release();
            reject(error);
        }
    });
}

UsersModel.createUser = async (user, address, alergies, type) => {
    try {
        const connection = await db.getConnection();
        await connection.beginTransaction();

        try {
            
            const insertPersonaQuery = `INSERT INTO persona (Active, Nombre, Apellido_Paterno,${user.Apellido_Materno.length > 0 ? ' Apellido_Materno, ' : ' '}${user.CURP.length > 0 ? 'CURP, ' : ''}Genero, Fecha_De_Nacimiento, Tipo_De_Sagre,${user.Numero_De_Emergencia.length > 0 ? ' Numero_De_Emergencia, ' : ' '}Numero_De_Telefono,${user.Nacionalidad.length > 0 ? ' Nacionalidad, ' : ' '}Correo_Electronico, Rol${user.Imagen.length > 0 ? ', Imagen' : ''})`;
            const insertPersonaValues = `VALUES (false, "${user.Nombre}", "${user.Apellido_Paterno}",${user.Apellido_Materno.length > 0 ? ` "${user.Apellido_Materno}", ` : ' '}${user.CURP.length > 0 ? `"${user.CURP}", ` : ''}"${user.Genero}", "${user.Fecha_De_Nacimiento}", "${user.Tipo_De_Sagre}",${user.Numero_De_Emergencia.length > 0 ? ` "${user.Numero_De_Emergencia}", ` : ' '}"${user.Numero_De_Telefono}",${user.Nacionalidad.length > 0 ? ` "${user.Nacionalidad}", ` : ' '}"${user.Correo_Electronico}", "${user.Rol}"${user.Imagen.length > 0 ? `, "${user.Imagen}"` : ''})`;
            await connection.query(insertPersonaQuery+insertPersonaValues);

            const [userInserted] = await connection.query('SELECT ID_Persona FROM persona WHERE correo_electronico = "'+user.Correo_Electronico+'"');

            const hashedPassword = crypto.createHash('md5').update(user.Contraseña).digest('hex');
            await connection.query('INSERT INTO credenciales (FK_Persona, Correo, Contraseña) VALUES ("'+userInserted[0].ID_Persona+'", "'+user.Correo_Electronico+'", "'+hashedPassword+'")');

            const insertDireccionQuery = `INSERT INTO direccion (FK_Persona, Ciudad, Estado, Pais, Codigo_Postal,${address.Numero_Interior.length > 0 ? ' Numero_Interior, ' : ' '}Numero_Exterior, Calle) VALUES ("${userInserted[0].ID_Persona}", "${address.Ciudad}", "${address.Estado}", "${address.Pais}", "${address.Codigo_Postal}",${address.Numero_Interior.length > 0 ? ` "${address.Numero_Interior}", ` : ' '}"${address.Numero_Exterior}", "${address.Calle}")`;
            await connection.query(insertDireccionQuery);

            if(alergies.length > 0){
                alergies.forEach(async(alergie) => {
                    await connection.query(`INSERT INTO alergias (Nombre,${alergie.Descripcion.length > 0 ? ' Descripcion, ' : ' '}FK_Persona) VALUES ("${alergie.Nombre}",${alergie.Descripcion.length > 0 ? ` "${alergie.Descripcion}", ` : ' '}"${userInserted[0].ID_Persona}")`);
                });
            }

            switch(user.Rol){
                case 'Administrativo':
                    const insertAdminQuery = `INSERT INTO administrativos (FK_Persona,${type.Codigo_De_Administrativo.length > 0 ? ' Codigo_De_Administrativo, ' : ' '}NSS, Fecha_De_Contratacion, URL) VALUES ("${userInserted[0].ID_Persona}" ,${type.Codigo_De_Administrativo.length > 0 ? ` "${type.Codigo_De_Administrativo}", ` : " "}"${type.NSS}", "${type.Fecha_De_Contratacion}", "${type.URL.length > 0 ? type.URL : null}")`;
                    await connection.query(insertAdminQuery);
                    await connection.query(`UPDATE persona SET Active = TRUE WHERE ID_Persona = "${userInserted[0].ID_Persona}"`);
                    break;
                case 'Profesor':
                    const insertTeacherQuery = `INSERT INTO profesor (FK_Persona,${type.Codigo_De_Profesor.length > 0 ? ' Codigo_De_Profesor, ' : ' '}NSS, Fecha_De_Contratacion, URL) VALUES ("${userInserted[0].ID_Persona}",${type.Codigo_De_Profesor.length > 0 ? ` "${type.Codigo_De_Profesor.length}", ` : ' '}"${type.NSS}", "${type.Fecha_De_Contratacion}", "${type.URL.length > 0 ? type.URL : null}")`;
                    await connection.query(insertTeacherQuery);
                    await connection.query(`UPDATE persona SET Active = TRUE WHERE ID_Persona = "${userInserted[0].ID_Persona}"`);
                    break;
                case 'Estudiante':
                    const insertStudentQuery = `INSERT INTO estudiante (FK_Persona${type.Matricula ? ', Matricula': ''}${type.URL ? ', ULR': ''}) VALUES ("${userInserted[0].ID_Persona}"${type.Matricula ? `, "${type.Matricula}"`: ''}${type.URL ? `, "${type.URL}"`: ''})`;
                    await connection.query(insertStudentQuery);
                    break;
                case 'Padre':
                    //Hacer padre
                    //await connection.query(`UPDATE persona SET Active = TRUE WHERE ID_Persona = "${userInserted[0].ID_Persona}"`);
                    break;
            }

            await connection.commit();
            connection.release();

            return {
                success: true,
                message: 'El usuario fue registrado con exito',
                data: userInserted[0].ID_Persona
            }

        } catch (error) {
            await connection.rollback();
            connection.release();
            throw error;
        }
        
    } catch (error) {
        connection.release();
        console.log(error.message);
        throw error;
    }
}

UsersModel.getUserById = async (id_user) => {
    
    const connection = await db.getConnection();

    return new Promise(async (resolve, reject) => {
        try {
            const [result] = await connection.query(`SELECT Nombre, Apellido_Paterno, Apellido_Materno, CURP, Genero, Fecha_De_Nacimiento, Tipo_De_Sagre, Numero_De_Emergencia, Numero_De_Telefono, Nacionalidad, Correo_Electronico, Rol, Active, Imagen FROM persona WHERE ID_Persona = "${id_user}"`);
            connection.release();
    
            resolve(result[0]);
        } catch (error) {
            connection.release();
            console.log(error.message);
            reject(error);
        }
    })
}

UsersModel.verifyUserId = async(id_user) => {
    const connection = await db.getConnection();
    return new Promise(async (resolve, reject) => {
        try {
            
            const [result] = await connection.query(`SELECT * FROM persona WHERE ID_Persona = "${id_user}"`);
            connection.release();

            if(result.length > 0){
                resolve('Exist');
            }else{
                reject(new Error('El usuario no existe'));
            }

        } catch (error) {
            connection.release();
            console.log(error.message);
            reject(error);
        }
    })
}

UsersModel.existUserImage = async(id_user) => {
    try {
        const deleteDir = path.join(__dirname, `../../global/storage/user_profiles/${id_user}`);
        await UsersHelpers.deleteImage(deleteDir);
        resolve(true);
    } catch (error) {
        reject(error);
    }
}


UsersModel.updateUserImage = async(id_uder, filename) => {
    const connection = await db.getConnection();

    return new Promise(async (resolve, reject) => {
        try {

            const now = new Date();
            const formattedDate = format(now, 'yyyy-MM-dd HH:mm:ss');

            const [result] = await connection.query(`UPDATE persona SET Imagen = "${filename}", Actualizado_EN = "${formattedDate}" WHERE ID_Persona = "${id_uder}"`);
            connection.release();

            if(result.affectedRows > 0){
                resolve(true);
            }else{
                reject(new Error('Hubo un error actualizando la iamgen en la base de datos'));
            }
        } catch (error) {
            connection.release();
            console.log(error.message);
            reject(error);
        }
    })
}

UsersModel.deleteUserImage = async (id_user) => {
    const connection = await db.getConnection();

    return new Promise(async (resolve, reject) => {
        try {
            const deleteDir = path.join(__dirname, `../../global/storage/user_profiles/${id_user}`);
            await UsersHelpers.deleteImage(deleteDir);

            const [result] = await connection.query(`UPDATE persona SET Imagen = null WHERE ID_Persona = "${id_user}"`);
            connection.release();

            if(result.affectedRows > 0){
                resolve(true);
            }else{
                reject(new Error('Hubo un error eliminando la iamgen en la base de datos'));
            }

        } catch (error) {
            connection.release();
            reject(error);
        }
    })
}

UsersModel.updateInformation = async (user, user_id) => {
    const connection = await db.getConnection();

    return new Promise(async (resolve, reject) => {
        try {
            let updateString = "";

            for (const key in user) {
                if (user.hasOwnProperty(key)) {

                    if(key === 'Fecha_De_Nacimiento'){
                        const date = new Date(user[key]);
                        const formattedDate = date.toISOString().slice(0, 19).replace("T", " ");

                        updateString += `${key} = ${user[key] != '' && user[key] != null ? `"${ formattedDate }"` : null}`;
                        if (key !== Object.keys(user)[Object.keys(user).length - 1]) {
                            updateString += ", ";
                        }
                    }else if(key === 'Numero_De_Telefono'){
                        updateString += `${key} = ${user[key] != '' && user[key] != null ? `${ user[key] }` : null}`;
                        if (key !== Object.keys(user)[Object.keys(user).length - 1]) {
                            updateString += ", ";
                        }
                    }else{
                        updateString += `${key} = ${user[key] != '' && user[key] != null ? `"${ user[key] }"` : null}`;
                        if (key !== Object.keys(user)[Object.keys(user).length - 1]) {
                            updateString += ", ";
                        }
                    }
                }
            }

            const now = new Date();
            const formattedDate = format(now, 'yyyy-MM-dd HH:mm:ss');

            const [result] = await connection.query(`UPDATE persona SET ${updateString}, Actualizado_EN = "${formattedDate}" WHERE ID_Persona = "${user_id}"`);
            connection.release();

            if(result.affectedRows > 0){
                resolve();
            }else{
                reject(new Error('Hubo un error eliminando la iamgen en la base de datos'));
            }
        } catch (error) {
            connection.release();
            reject(error);
        }
    })
}

module.exports = UsersModel;