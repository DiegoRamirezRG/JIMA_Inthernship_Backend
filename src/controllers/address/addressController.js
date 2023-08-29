const AddressModel = require('../../models/address/addressModel');


module.exports = {

    async getAddressById(req, res, next){
        try {
            const userId = req.params.userId;
            const address = await AddressModel.getAddressByUserId(userId);

            return res.status(201).json({
                success: false,
                message: 'Direccion obtenida con exito',
                data: address
            })

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Ha ocurrido un error al obtener la direccion',
                error: error
            })
        }
    }

}