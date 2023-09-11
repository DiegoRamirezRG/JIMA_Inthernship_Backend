const RolesModel = require('../../models/roles/rolesModel');

module.exports = {

    async getRolInfoByUserId(req, res, next){
        try {
            const userId = req.params.userId;

            const rolesInfo = await RolesModel.getInfoByUserId(userId);

            return res.status(201).json({
                success: true,
                message: 'Datos obtenidos con exito',
                data: rolesInfo
            })

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Ha ocurrido un error al obtener la informacion del Rol',
                error: error
            })
        }
    }

}