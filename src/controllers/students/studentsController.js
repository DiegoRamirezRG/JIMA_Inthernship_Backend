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
    },

    async getActiveEnroll(req, res, next){
        try {
            
            const { id_student } = req.params;

            if(!id_student){
                throw new Error('Datos faltantes');
            }

            await StudentModel.verifyIsStudent(id_student);
            const enrolled = await StudentModel.getActiveEnrolled(id_student);
            
            return res.status(201).json({
                success: true,
                message: 'Ultimo ciclo inscrito obtenido con exito',
                data: enrolled
            })

        } catch (error) {
            return res.status(501).json({
                success: false,
                message: 'Ha ocurrido un error al cancelar el registro del Aspirante',
                error: error.message
            });
        }
    },

    async getLastStudents(req, res, next){
        try {
            const students = await StudentModel.getLastCycleStudents();

            return res.status(201).json({
                success: true,
                message: 'Estudiantes obtenidos con exito',
                data: students
            })
        } catch (error) {
            return res.status(501).json({
                success: false,
                message: 'Ha ocurrido un error al obtener los estudiantes',
                error: error.message
            });
        }
    },

    async getStudentsToBe(req, res, next){
        try {
            const studentsToBe = await StudentModel.getStudentsToBe();

            return res.status(201).json({
                success: true,
                message: 'Aspirantes obtenidos con exito',
                data: studentsToBe
            })
        } catch (error) {
            return res.status(501).json({
                success: false,
                message: 'Ha ocurrido un error al obtener los aspirantes',
                error: error.message
            });
        }
    },

    async getStudentClassesById(req, res, next){
        try {
            
            const classes = await StudentModel.getClassesById(req.params.person_id);
            return res.status(201).json({
                success: true,
                message: 'Clases Obtenidas con exito',
                data: classes
            });

        } catch (error) {
            return res.status(501).json({
                success: false,
                message: 'Ha ocurrido un error al obtener las clases',
                error: error.message
            });
        }
    },

    async getStdudentToDoAssigments(req, res, next){
        try {
            const person_id = req.params.person_id;

            const student_id = await StudentModel.getStudentIdByPersonId(person_id);
            const todo = await StudentModel.getTodoAssigmentes(student_id);

            return res.status(201).json({
                success: true,
                message: 'Tareas pendientes obtenidas con exito',
                data: todo
            });

        } catch (error) {
            return res.status(501).json({
                success: false,
                message: 'Ha ocurrido un error al obtener las tareas pendientes',
                error: error.message
            });
        }
    }

}