const SchoolInfoModel = require('../../models/school_info/school_infoModel');

module.exports = {

    async getSchoolShifts(req, res, next){
        try {
            const data = await SchoolInfoModel.getShifts();

            return res.status(201).json({
                success: true,
                message: 'Turnos obtenidos con exito',
                data: data
            });
        } catch (error) {
            return res.status(501).json({
                success: false,
                message: 'Ha ocurrido un error al obtener los turnos',
                error: error.message
            });
        }
    },

    async createSchoolShift(req, res, next){
        try {

            const { Nombre, Hora_Inicio, Hora_Fin } = req.body;

            if(!Nombre || !Hora_Inicio || !Hora_Fin){
                throw new Error('Datos faltantes');
            }

            await SchoolInfoModel.createShift(Nombre, Hora_Inicio, Hora_Fin);

            return res.status(201).json({
                success: true,
                message: 'Turno creado con exito',
            });
        } catch (error) {
            return res.status(501).json({
                success: false,
                message: 'Ha ocurrido un error al crear el turno',
                error: error.message
            });
        }
    },

    async updateSchoolShift(req, res, next){
        try {
            
            const { ID_Turno, Nombre, Hora_Inicio, Hora_Fin } = req.body;

            if(!ID_Turno || !Nombre || !Hora_Inicio || !Hora_Fin){
                throw new Error('Datos faltantes');
            }

            await SchoolInfoModel.validateShiftID(ID_Turno);
            await SchoolInfoModel.updateShift(ID_Turno, Nombre, Hora_Inicio, Hora_Fin);

            return res.status(201).json({
                success: true,
                message: 'Turno actualizado con exito',
            })

        } catch (error) {
            return res.status(501).json({
                success: false,
                message: 'Ha ocurrido un error al actualizar el turno',
                error: error.message
            });
        }
    },

    async getSchoolGrades(req, res, next){
        try {
            const data = await SchoolInfoModel.getGrades();

            return res.status(201).json({
                success: true,
                message: 'Grados obtenidos con exito',
                data: data
            });
        } catch (error) {
            return res.status(501).json({
                success: false,
                message: 'Ha ocurrido un error al obtener los grados',
                error: error.message
            });
        }
    },

    async createSchoolGrade(req, res, next){
        try {

            const { Nombre, Descripcion } = req.body;

            if(!Nombre || !Descripcion){
                throw new Error('Datos faltantes');
            }

            await SchoolInfoModel.createGrade(Nombre, Descripcion);

            return res.status(201).json({
                success: true,
                message: 'Grado creado con exito',
            });
        } catch (error) {
            return res.status(501).json({
                success: false,
                message: 'Ha ocurrido un error al crear el grado',
                error: error.message
            });
        }
    },
    
    async getSchoolGroups(req, res, next){
        try {
            const data = await SchoolInfoModel.getGroups();

            return res.status(201).json({
                success: true,
                message: 'Grupos obtenidos con exito',
                data: data
            });
        } catch (error) {
            return res.status(501).json({
                success: false,
                message: 'Ha ocurrido un error al obtener los grupos',
                error: error.message
            });
        }
    },

    async createSchoolGroup(req, res, next){
        try {

            const { Indicador } = req.body;

            if(!Indicador){
                throw new Error('Datos faltantes');
            }

            await SchoolInfoModel.createGroup(Indicador);

            return res.status(201).json({
                success: true,
                message: 'Grupo creado con exito',
            });
        } catch (error) {
            return res.status(501).json({
                success: false,
                message: 'Ha ocurrido un error al crear el grupo',
                error: error.message
            });
        }
    },
}