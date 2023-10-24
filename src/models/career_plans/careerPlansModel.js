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

module.exports = CareerPlansModel;