const AddressModel = require('../../models/address/addressModel');
const UserModel = require('../../models/users/usersModel');

module.exports = {

    async getAddressById(req, res, next){
        try {
            const userId = req.params.userId;
            const address = await AddressModel.getAddressByUserId(userId);

            return res.status(201).json({
                success: true,
                message: 'Direccion obtenida con exito',
                data: address
            })

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Ha ocurrido un error al obtener la direccion',
                error: error.message
            })
        }
    },

    async updateAddressData(req, res, next){
        try {
            
            const userId = req.params.userId;
            await UserModel.verifyUserId(userId);

            const address = req.body;
            const result = await AddressModel.updateAddress(userId, address);

            return res.status(201).json({
                success: true,
                message: 'Direccion actualizada con exito',
                data: result
            })

        } catch (error) {
            return res.status(501).json({
                success: false,
                message: 'Ha ocurrido un error al actualizar la direccion',
                error: error.message
            })
        }
    }

}