const db = require('../../config/databaseConfig');
const PaymentsModel = {};

PaymentsModel.getAllPayments = async () => {
    const connection = await db.getConnection();
    return new Promise(async (resolve, reject) => {
        try {
            const [result] = await connection.query('SELECT * FROM costes');
            connection.release();
            resolve(result);
        } catch (error) {
            connection.release();
            console.error(error);
            reject(error);
        }
    })
}

PaymentsModel.createAutoBasicPayments = async () => {
    const connection = await db.getConnection();
    return new Promise(async (resolve, reject) => {
        try {
            await connection.query('CALL create_basic_payments()');
            connection.release();
            resolve();
        } catch (error) {
            connection.release();
            console.error(error);
            reject(error);
        }
    })
}

PaymentsModel.updatePayment = async (payment) => {
    const connection = await db.getConnection();
    return new Promise(async (resolve, reject) => {
        try {
            connection.beginTransaction();

            const [result] = await connection.query('UPDATE costes SET Concepto = ?, Descripcion = ?, Coste = ?, Vigencia = ?, Refenrencia_Bancaria = ?, Active = ?, Actualizado_EN = NOW() WHERE ID_Costo = ?', [
                payment.Concepto,
                payment.Descripcion,
                parseFloat(payment.Coste),
                parseInt(payment.Vigencia),
                payment.Refenrencia_Bancaria,
                payment.Active,
                payment.ID_Costo
            ]);

            if(result.affectedRows > 0){
                connection.commit();
                connection.release();
                resolve();
            }else{
                throw new Error('Ha ocurrido un error al actualizar el servicio');
            }
        } catch (error) {
            connection.rollback();
            connection.release();
            console.error(error);
            reject(error);
        }
    })
}

PaymentsModel.createNewPayment = async (payment) => {
    const connection = await db.getConnection();
    return new Promise(async (resolve, reject) => {
        try {
            connection.beginTransaction();

            const [result] = await connection.query('INSERT INTO costes(Concepto, Descripcion, Coste, Vigencia, Refenrencia_Bancaria, Active) VALUES(?, ?, ?, ?, ?, ?)', [
                payment.Concepto,
                payment.Descripcion,
                parseFloat(payment.Coste),
                payment.Vigencia == '' ? null : parseInt(payment.Vigencia),
                payment.Refenrencia_Bancaria == '' ? null : payment.Refenrencia_Bancaria,
                payment.Active
            ]);

            if(result.affectedRows > 0){
                connection.commit();
                connection.release();
                resolve();
            }else{
                throw new Error('Ha ocurrido un error al crear el servicio');
            }
        } catch (error) {
            connection.rollback();
            connection.release();
            console.error(error);
            reject(error);
        }
    })
}

PaymentsModel.chargeStudentPayment = async (person_id, payment_id) => {
    const connection = await db.getConnection();
    return new Promise(async (resolve, reject) => {
        try {
            connection.beginTransaction();

            const [result] = await connection.query('CALL insert_payment_person(?,?)', [
                person_id, payment_id
            ]);

            if(result.affectedRows > 0){
                connection.commit();
                connection.release();
                resolve();
            }else{
                throw new Error('Ha ocurrido un error al hacer el cargo')
            }
        } catch (error) {
            connection.rollback();
            connection.release();
            console.error(error);
            reject(error);
        }
    })
}

PaymentsModel.getAllStandByPayments = async () => {
    const connection = await db.getConnection();
    return new Promise(async (resolve, reject) => {
        try {
            const [result] = await connection.query(`SELECT pc.ID_Persona_Coste, pc.Creado_En, p.ID_Persona, CONCAT(p.Nombre, ' ', p.Apellido_Paterno, ' ', p.Apellido_Materno) as Estudiante_Nombre, p.Imagen, c.Concepto, c.Descripcion, c.Coste, c.Vigencia, c.Refenrencia_Bancaria
            FROM persona_coste pc
            JOIN persona p ON p.ID_Persona = pc.FK_Persona 
            JOIN costes c ON c.ID_Costo = pc.FK_Coste
            WHERE pc.Pagado = FALSE`);

            connection.release();
            resolve(result);
        } catch (error) {
            connection.release();
            console.error(error);
            reject(error);
        }
    })
}

PaymentsModel.getPaymentDetail = async (person_id) => {
    const connection = await db.getConnection();
    return new Promise(async (resolve, reject) => {
        try {
            const [result] = await connection.query(`SELECT pc.Folio, pc.Creado_En, c.Concepto, c.Descripcion, c.Coste, c.Vigencia, c.Refenrencia_Bancaria FROM persona_coste pc
            JOIN costes c ON pc.FK_Coste = c.ID_Costo
            WHERE pc.FK_Persona = ?`, [ person_id ]);

            connection.release();
            resolve(result[0]);
        } catch (error) {
            connection.release();
            console.error(error);
            reject(error);
        }
    })
}

PaymentsModel.markAsPayed = async (person_payment_id) => {
    const connection = await db.getConnection();
    return new Promise(async( resolve, reject) => {
        try {
            connection.beginTransaction();
            const [result] = await connection.query('UPDATE persona_coste SET Pagado = TRUE, Actualizado_EN = NOW() WHERE ID_Persona_Coste = ?', [ person_payment_id ]);

            if(result.affectedRows > 0){
                connection.commit();
                connection.release();
                resolve();
            }else{
                throw new Error('Ha ocurrido un error al actualizar el estado del pago');
            }
        } catch (error) {
            connection.rollback();
            connection.release();
            console.error(error);
            reject(error);
        }
    })
}

PaymentsModel.deletePayment = async (person_payment_id) => {
    const connection = await db.getConnection();
    return new Promise(async (resolve, reject) => {
        try {
            connection.beginTransaction();
            const [result] = await connection.query('DELETE FROM persona_coste WHERE ID_Persona_Coste = ?', [ person_payment_id ]);

            if(result.affectedRows > 0 && result.affectedRows < 2){
                connection.commit();
                connection.release();
                resolve();
            }else{
                throw new Error('Ha ocurrido un error al eliminar el cargo');
            }
        } catch (error) {
            connection.rollback();
            connection.release();
            console.error(error);
            reject(error);
        }
    })
}

module.exports = PaymentsModel;