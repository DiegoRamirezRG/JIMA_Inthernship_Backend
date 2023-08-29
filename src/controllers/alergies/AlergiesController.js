
const AlergiesModel = require('../../models/alergies/alergiesModel');

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
                error: error
            })
        }
    }

}
