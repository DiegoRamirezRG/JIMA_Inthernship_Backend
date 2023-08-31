const LocationModel = require('../../models/location/locationModel');

module.exports = {

    async getCountries(req, res, next){
        try {
            const countries = await LocationModel.getCountries();
            return res.status(201).json({
                success: true,
                message: 'Datos obtenidos con exito',
                data: countries
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Ha ocurrido un error al obtener los paises',
                error: error.message
            })
        }
    },

    async getStates(req, res, next){
        try {
            
            const country = req.params.countryName;

            const states = await LocationModel.getStates(country);

            return res.status(201).json({
                success: true,
                message: 'Datos obtenidos con exito',
                data: states
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Ha ocurrido un error al obtener los estados',
                error: error.message
            })
        }
    },

    async getCities(req, res, next){
        try {
            
            const state = req.params.stateName;

            const cities = await LocationModel.getCities(state);

            return res.status(201).json({
                success: true,
                message: 'Datos obtenidos con exito',
                data: cities
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Ha ocurrido un error al obtener las ciudades',
                error: error.message
            })
        }
    }

}