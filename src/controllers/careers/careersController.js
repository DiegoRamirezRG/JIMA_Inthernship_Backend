const CareerModel = require('../../models/careers/careersModel');

module.exports = {
    async getCareers(req, res, next){
        try {
            
            const data = await CareerModel.getAllCareers();

            return res.status(201).json({
                success: true,
                message: 'Carreras obtenidas con exito',
                data: data
            })

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Ha ocurrido un error al obtener las Carreras',
                error: error.message
            })
        }
    },

    async getCareersActve(req, res, next){
        try {
            
            const data = await CareerModel.getAllCareersActive();

            return res.status(201).json({
                success: true,
                message: 'Carreras obtenidas con exito',
                data: data
            })

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Ha ocurrido un error al obtener las Carreras',
                error: error.message
            })
        }
    },

    async createCareer(req, res, next){
        try {
            const { Nombre, Numero_De_Ciclos, Duracion_Mensual_De_Ciclos, Descripcion } = req.body;

            if(!Nombre || !Numero_De_Ciclos || Numero_De_Ciclos < 0 || !Duracion_Mensual_De_Ciclos || Duracion_Mensual_De_Ciclos < 0){

                return res.status(400).json({
                    success: false,
                    message: 'Ha ocurrido un error al crear las Carreras',
                    error: 'Faltan campos necesarios para la creacion de la carrera'
                })

            }else{
                await CareerModel.createCareer(Nombre, Numero_De_Ciclos, Duracion_Mensual_De_Ciclos, Descripcion);

                return res.status(201).json({
                    success: true,
                    message: 'Carrera creada con exito',
                    data: true
                })
            }
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Ha ocurrido un error al crear las Carreras',
                error: error.message
            })
        }
    },

    async updateCareer(req, res, next){
        try {
            
            const { ID_Carrera, Nombre, Numero_De_Ciclos, Duracion_Mensual_De_Ciclos, Descripcion, Active } = req.body;

            if(!ID_Carrera || !Nombre || !Numero_De_Ciclos || Numero_De_Ciclos < 0 || !Duracion_Mensual_De_Ciclos  || Duracion_Mensual_De_Ciclos < 0){
                return res.status(400).json({
                    success: false,
                    message: 'Ha ocurrido un error al crear las Carreras',
                    error: 'Faltan campos necesarios para la creacion de la carrera'
                })
            }else{

                await CareerModel.updateCareer(ID_Carrera, Nombre, Numero_De_Ciclos, Duracion_Mensual_De_Ciclos, Descripcion, Active);
                return res.status(201).json({
                    success: true,
                    message: 'Carrera actualizada con exito',
                    data: true
                })

            }
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Ha ocurrido un error al actualizar la Carrera',
                error: error.message
            })
        }
    }
}