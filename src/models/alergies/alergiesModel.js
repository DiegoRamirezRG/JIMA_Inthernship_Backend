const db = require('../../config/databaseConfig');
const { format } = require('date-fns');

const AlergiesModel = {};

AlergiesModel.getAlergiesByUserId = async (userId) => {

    const connection = await db.getConnection();
    return new Promise(async(resolve, reject) => {
        try {
            
            const [alergies] = await connection.query(`SELECT ID_Alergia, Nombre, Descripcion FROM alergias WHERE FK_Persona = "${userId}"`);
            connection.release();
            resolve(alergies);

        } catch (error) {
            connection.release();
            console.log(error);
            reject(error);
        }
    })
}

AlergiesModel.updateAlergies = async (userId, userData, alergiesData) => {
    const connection = await db.getConnection();
    return new Promise(async (resolve, reject)=> {
        connection.beginTransaction();
        try {
            let insertionValues = '';
            let updateString = '';
            const formattedDate = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
            const jsonArrayAux = [];

            const [existAlergies] = await connection.query(`SELECT COUNT(*) FROM alergias WHERE FK_Persona = "${userId}"`)

            if(existAlergies[0].count > 0){
                const [deletePastAlergies] = await connection.query(`DELETE FROM alergias WHERE FK_Persona = "${userId}"`);

                if(deletePastAlergies.affectedRows !== existAlergies[0].count){
                    throw new Error('Ocurrio un error actualizando las alergias');
                }
            }

            if(alergiesData.length > 0){
                for (let i = 0; alergiesData[i]; i++) {
                    jsonArrayAux.push(alergiesData[i]);
                }
    
                for (let index = 0; index < jsonArrayAux.length; index++) {
                    insertionValues += `("${jsonArrayAux[index].Nombre}", "${jsonArrayAux[index].Descripcion}", "${userId}")`;
    
                    if (index < jsonArrayAux.length - 1) {
                        insertionValues += ', ';
                    }
                }
            }

            for (const key in userData) {
                if (userData.hasOwnProperty(key)) {
                    if(key === 'Numero_de_Emergencia'){
                        updateString += `${key} = ${userData[key] != '' && userData[key] != null ? `${ userData[key] }` : null}`;

                        if (key !== Object.keys(userData)[Object.keys(userData).length - 1]) {
                            updateString += ", ";
                        }
                    }else{
                        updateString += `${key} = ${userData[key] != '' && userData[key] != null ? `"${ userData[key] }"` : null}`;

                        if (key !== Object.keys(userData)[Object.keys(userData).length - 1]) {
                            updateString += ", ";
                        }
                    }
                }
            }

            if(alergiesData.length > 0){
                const [insertAlergies] = await connection.query(`INSERT INTO alergias(Nombre, Descripcion, FK_Persona) VALUES ${insertionValues}`);
                const [updateUserData] = await connection.query(`UPDATE persona SET ${updateString}, Actualizado_EN = "${formattedDate}" WHERE ID_Persona = "${userId}"`);

                if(insertAlergies.affectedRows > 0 && updateUserData.affectedRows > 0){
                    connection.commit();
                    connection.release();
                    resolve();
                }else{
                    throw new Error('Ocurrio un error actualizando las alergias');
                }
            }else{
                const [updateUserData] = await connection.query(`UPDATE persona SET ${updateString}, Actualizado_EN = "${formattedDate}" WHERE ID_Persona = "${userId}"`);

                if(updateUserData.affectedRows > 0){
                    connection.commit();
                    connection.release();
                    resolve();
                }else{
                    throw new Error('Ocurrio un error actualizando las alergias');
                }
            }

            
        } catch (error) {
            connection.rollback();
            connection.release();
            console.log(error);
            reject(error);
        }
    })
}

module.exports = AlergiesModel;