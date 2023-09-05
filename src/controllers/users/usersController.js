const multer = require('multer');
const { user_profile_bucket } = require('../../config/multerConfig');

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
    },

    async uploadUserProfile(req, res, next){
        try {

            const id_user = req.params.user_id;
            await UsersModel.verifyUserId(id_user);

            const bucket = multer({storage: await user_profile_bucket(id_user)}).single('file');
            await bucket(req, res, async (err) => {
                if(err){
                    console.error(`Error: ${err}`);
                    return res.status(501).json({
                        success: false,
                        message: 'Hubo un error subiendo la imágene del perfil',
                        error: err.message
                    });
                }

                
                const updated = await UsersModel.updateUserImage(id_user, req.file.filename);

                return res.status(201).json({
                    success: true,
                    message: 'Imágene del perfil subida correctamente',
                    data: req.file.filename
                });
            })

        } catch (error) {
            return res.status(501).json({
                success: false,
                message: 'Hubo un error subiendo la imágene del perfil',
                error: error.message
            });
        }
    }

}