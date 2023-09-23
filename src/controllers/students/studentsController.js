const StudentModel = require('../../models/students/studentsModel');
const UsersModel = require('../../models/users/usersModel');

module.exports = {

    async getStudentData(req, res, next){
        try {
            const user_id = req.params.id_user;
            await UsersModel.verifyUserId(user_id);

            const isEnrolled = await StudentModel.isStudentEnrolled(user_id);
            const isEnlisted = await StudentModel.isStudentEnlisted(user_id);

            if(isEnrolled == 1){

                const studentToBe = await StudentModel.getStudentToBeData(user_id);
                return res.status(201).json({
                    success: true,
                    message: 'Data del Aspirante obtenida',
                    data: studentToBe
                });

            }else if(isEnlisted){

                const student = await StudentModel.getEnrolledStudentData(user_id);
                return res.status(201).json({
                    success: true,
                    message: 'Data del Estudiante obtenida',
                    data: student
                });

            }else{

                return res.status(201).json({
                    success: true,
                    message: 'El estudiante no se encuentra en funcion',
                    data: null
                });

            }

        } catch (error) {
            return res.status(501).json({
                success: false,
                message: 'Ha ocurrido un error al obtener la Informacion del Estudiante',
                error: error.message
            });
        }
    },

    async registerStudentToBe(req, res, next){
        try {
            
            const { ID_Student, ID_Career } = req.body;
            console.log(ID_Student);
            console.log(ID_Career);

            await StudentModel.verifyIsStudent(ID_Student);
            await StudentModel.createStudentToBe(ID_Student, ID_Career);

            return res.status(201).json({
                success: true,
                message: 'Se ha registrado al Estudiante Aspirante con exito',
                data: true
            });

        } catch (error) {
            return res.status(501).json({
                success: false,
                message: 'Ha ocurrido un error al registrar al Estudiante Aspirante',
                error: error.message
            });
        }
    },

    async enrollStudentCustom(req, res, next){
        try {
            
            const {ID_Student, ID_Career, ID_Grado, ID_Grupo, ID_Turno} = req.body;

            if(!ID_Career || !ID_Grado || !ID_Grupo || !ID_Turno){
                throw new Error('Datos faltantes')
            }

            await StudentModel.createCustomStudent(ID_Student, ID_Career, ID_Grado, ID_Grupo, ID_Turno);

            return res.status(201).json({
                success: true,
                message: 'Se ha registrado al Estudiante a una clase',
                data: true
            })

        } catch (error) {
            return res.status(501).json({
                success: false,
                message: 'Ha ocurrido un error al registrar al Estudiante a una clase',
                error: error.message
            });
        }
    },

    async cancelStudentToBeRegister(req, res, next){
        try {
            
            const user_id = req.params.user_id;

            await UsersModel.verifyUserId(user_id);

            const student_id = await StudentModel.getStudentId(user_id);
            await StudentModel.deleteAspiranteRegister(student_id);

            return res.status(201).json({
                success: true,
                message: 'Se ha cancelado el registro del Aspirante'
            })

        } catch (error) {
            return res.status(501).json({
                success: false,
                message: 'Ha ocurrido un error al cancelar el registro del Aspirante',
                error: error.message
            });
        }
    }

}