const UsersModel = require('../../models/users/usersModel');
const UsersHelpers = require('../../utils/usersHelpers/userHelpers');

module.exports = {

    async getUsers(req, res, next){
        try {
            const {offset, order_by, nombre, rol, grado, grupo, turno} = req.body;

            const where = UsersHelpers.organizeWhere(nombre, rol, grado, grupo, turno);
            const users = await UsersModel.getUsers(where, offset, order_by);
            return res.status(201).json({
                success: true,
                message: 'Datos obtenidos con exito',
                data: users
            })

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Ha ocurrido un error al obtener los usuarios',
                error: error
            })
        }
    },

    async getPagination(req, res, next){
        try {
            const {offset, order_by, nombre, rol, grado, grupo, turno} = req.body;

            const where = UsersHelpers.organizeWhere(nombre, rol, grado, grupo, turno);
            const pagination = await UsersModel.getPagination(where);
            return res.status(201).json({
                success: true,
                message: 'Datos obtenidos con exito',
                data: pagination
            })

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Ha ocurrido un error al obtener la paginacion',
                error: error
            })
        }
    },

    async createUser(req, res, next){
        try {

            const {user, address, alergies, type} = req.body;

            const result = await UsersModel.createUser(user, address, alergies, type);

            return res.status(201).json({
                ...result
            })
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Ha ocurrido un error al crear el usuario',
                error: error
            })
        }
    },

    async getUserByID(req, res, next){
        try {
            
            const userId = req.params.idUser;
            const user = await UsersModel.getUserById(userId);

            return res.status(201).json({
                success: false,
                message: 'Usuario obtenido con exito',
                data: user
            })

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Ha ocurrido un error al obtener el usuario',
                error: error
            })
        }
    }

}