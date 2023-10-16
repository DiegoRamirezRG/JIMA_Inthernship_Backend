const SchoolarCycleModel = require('../../models/schoolar_cycle/SchoolarCycleModel');

module.exports = {

    async getBasicInitialDates(req, res, next){
        try {
            return res.status(201).json({
                success: true,
                message: 'Eventos Iniciales Existentes',
                data: true
            })
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Ha ocurrido un error al obtener los Eventos Inicialez',
                error: error.message || error
            })
        }
    }

}