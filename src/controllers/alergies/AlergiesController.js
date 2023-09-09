
const AlergiesModel = require('../../models/alergies/alergiesModel');
const UsersModel = require('../../models/users/usersModel');

module.exports = {

    async getAlergiesByUserId(req, res, next){
        try {
            
            const userId = req.params.userId;
            const alergies = await AlergiesModel.getAlergiesByUserId(userId);

            return res.status(201).json({
                success: true,
                message: 'Datos obtenidos con exito',
                data: alergies
            })

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Ha ocurrido un error al obtener las alergias',
                error: error.message
            })
        }
    },

    async updateAlergiesData(req, res, next){
        try {
            
            const userId = req.params.userId;
            await UsersModel.verifyUserId(userId);
            const {userData, alergiesData} = req.body;

            await AlergiesModel.updateAlergies(userId, userData, alergiesData);

            return res.status(201).json({
                success: true,
                message: 'Datos actualizados con exito',
            })

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Ha ocurrido un error al actualizar las alergias',
                error: error.message
            })
        }
    }

}
