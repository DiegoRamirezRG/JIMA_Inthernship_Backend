const db = require('../../config/databaseConfig');
const { format } = require('date-fns');
const AddressModel = {};

AddressModel.getAddressByUserId = async (userId) => {
    const connection = await db.getConnection();
    return new Promise(async (resolve, reject) => {
        try {
            const [result] = await connection.query(`SELECT Ciudad, Estado, Pais, Codigo_Postal, Numero_Interior, Numero_Exterior, Calle FROM direccion WHERE FK_Persona = "${userId}"`);
            connection.release();
            resolve(result[0]);
        } catch (error) {
            connection.release();
            console.log(error.message);
            reject(error);
        }
    })
}

AddressModel.updateAddress = async (userId, address) => {
    const connection = await db.getConnection();
    return new Promise(async (resolve, reject) => {
        try {
            
            let updateString = "";
            for( const key in address){
                if(address.hasOwnProperty(key)){
                    updateString += `${key} = ${address[key] != '' && address[key] != null ? `"${ address[key] }"` : null}`;
                    if (key !== Object.keys(address)[Object.keys(address).length - 1]) {
                        updateString += ", ";
                    }
                }
            }

            const formattedDate = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
            const [result] = await connection.query(`UPDATE direccion SET ${updateString}, Actualizado_EN = "${formattedDate}" WHERE FK_Persona = "${userId}"`);
            connection.release();

            if(result.affectedRows > 0){
                resolve();
            }else{
                throw new Error('Ocurrio un error al actualizar la direccion')
            }

        } catch (error) {
            connection.release();
            console.log(error.message);
            reject(error);
        }
    })
}

module.exports = AddressModel;