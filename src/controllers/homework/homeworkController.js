const multer = require('multer');
const HomeworkModel = require('../../models/homework/homeworkModel');
const { assigment_files_bucket, student_asigmnet_bucket } = require('../../config/multerConfig');

module.exports = {
    
    async createRubric(req, res, next){
        try {

            const { person, criteria } = req.body;

            const data = await HomeworkModel.createRubric(person, criteria);

            return res.status(201).json({
                success: true,
                message: 'Se ha creado con exito la rubrica',
                data: data
            })

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Ha ocurrido un error al crear la rubrica',
                error: error.message || error
            })
        }
    },

    async getRubricsByPersonId(req, res, next){
        try {
            const personId = req.params.person_id;
            const data = await HomeworkModel.getAllRubricsByPersonId(personId);

            for (let i = 0; i < data.length; i++) {
                const criteria = await HomeworkModel.getCriteriaByRubricId(data[i].ID_Rubrica);
                data[i].criterias = criteria;
            }

            return res.status(201).json({
                success: true,
                message: 'Se han obtenido con exito la rubricas',
                data: data
            })
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Ha ocurrido un error al obtener las rubricas',
                error: error.message || error
            })
        }
    },
    
    async createUnit(req, res, next){
        try {
            const { title, classId, rubric } = req.body;

            if(rubric){
                await HomeworkModel.createUnitWithRubric(title, classId, rubric);
            }else{
                await HomeworkModel.createUnit(title, classId);
            }

            return res.status(201).json({
                success: true,
                message: 'Se ha creado la unidad con exito',
                data: {title, rubric, classId}
            })

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Ha ocurrido un error al crear la unidad',
                error: error.message || error
            })
        }
    },

    async getAllUnitsByClassId(req, res, next){
        try {
            const classid = req.params.class_id;
            const data = await HomeworkModel.getUnitsByClassId(classid);

            return res.status(201).json({
                success: true,
                message: 'Se han obtenido con exito las unidades',
                data: data
            }) 

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Ha ocurrido un error al obtener las unidades de la clase',
                error: error.message || error
            })
        }
    },

    async createWork(req, res, next){
        try {
            
            const { assignData } = req.body;
            console.log(JSON.stringify(assignData, null, 4));

            const {Titulo, Descripcion, Fecha_De_Entrega, FK_Clase, FK_Rubrica, Fk_Unidad, Alumnos_Actividad, Requiere_Anexos, Acepta_Despues, Calificable} = assignData;

            const data = await HomeworkModel.createWorkAssigment(Titulo, Descripcion, Fecha_De_Entrega, FK_Clase, FK_Rubrica, Fk_Unidad, Alumnos_Actividad, Requiere_Anexos, Acepta_Despues, Calificable);

            return res.status(201).json({
                success: true,
                message: 'Se ha creado la asignacion con exito',
                data: data
            }) 
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Ha ocurrido un error al crear la asignacion',
                error: error.message || error
            })
        }
    },

    async uploadAssigmentFiles (req, res, next){
        try {
            const assigmentId = req.params.assigment_id;
            const bucket = multer({storage: await assigment_files_bucket(assigmentId)}).array('files');
            await bucket(req, res, async (err) => {
                if(err){
                    console.error(`Error: ${err}`);
                    return res.status(501).json({
                        success: false,
                        message: 'Hubo un error subiendo los archivos adjuntos',
                        error: err.message
                    });
                }

                for (let j = 0; j < req.files.length; j++) {
                    await HomeworkModel.createAssignments(assigmentId, req.files[j].filename);
                }

                return res.status(201).json({
                    success: true,
                    message: 'Archivos adjuntos subidos con exito',
                });
            })

        } catch (error) {
            console.log(error);
            return res.status(500).json({
                success: false,
                message: 'Hubo un error subiendo los archivos adjuntos',
                error: error.message || error
            })
        }
    },

    async getAllAssigmentsWork(req, res, next){
        try {
            
            const class_id = req.params.class_id;
            const data = await HomeworkModel.getAllAssigmentsByClassId(class_id);

            return res.status(201).json({
                success: true,
                message: 'Asignaciones obtenidas con exito',
                data: data
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Hubo un error obteniendo las asignaciones',
                error: error.message || error
            })
        }
    },

    async getAttachedFiles(req, res, next){
        try {
            
            const assign_id = req.params.assign_id;
            const data = await HomeworkModel.getAttachedFilesByAssigment(assign_id);

            return res.status(201).json({
                success: true,
                message: 'Archivos obtenidas con exito',
                data: data
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Hubo un error obteniendo los archivos adjuntos',
                error: error.message || error
            })
        }
    },

    async getHomeworkStudentStatus(req, res, next){
        try {
            const assign_id = req.params.assign_id;
            const person_id = req.params.person_id;

            const data = await HomeworkModel.getStudentWorkStatus(assign_id, person_id);
            
            return res.status(201).json({
                success: true,
                message: 'Status obtenido con exito',
                data: data
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Hubo un error obteniendo los archivos adjuntos',
                error: error.message || error
            })
        }
    },

    async turnInAssigments(req, res, next){
        try {
            
            const { FK_Actividad, ID_Persona, Archivos } = req.body;

            await HomeworkModel.turnInStudentWork(FK_Actividad, ID_Persona, Archivos);

            return res.status(201).json({
                success: true,
                message: 'Se ha entregado la tarea con exito',
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: 'Ha ocurrido un error al entregar la tarea',
                error: error.message || error
            })
        }
    },

    async getStudentTurnInGradesByClass(req, res, next){
        try {
            
            const class_id = req.params.class_id;
            const person_id = req.params.person_id;

            const data = await HomeworkModel.getStudentGradesByClass(class_id, person_id);

            return res.status(201).json({
                success: true,
                message: 'Calificaciones obtenidas con exito',
                data: data
            })

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Ha ocurrido un error al obtener las calificaciones',
                error: error.message || error
            })
        }
    },

    async uploadStudentTurnInFile(req, res, next){
        try {
            const assigment_id = req.params.assigment_id;
            const person_id = req.params.person_id;

            const studentId = await HomeworkModel.getStudentIdByPersonId(person_id);

            const bucket = multer({storage: await student_asigmnet_bucket(assigment_id, studentId)}).array('files');
            await bucket(req, res, async (err) => {
                if(err){
                    console.error(`Error: ${err}`);
                    return res.status(501).json({
                        success: false,
                        message: 'Hubo un error subiendo los archivos adjuntos',
                        error: err.message
                    });
                }

                return res.status(201).json({
                    success: true,
                    message: 'Archivos adjuntos subidos con exito',
                });
            })

        } catch (error) {
            console.log(error);
            return res.status(500).json({
                success: false,
                message: 'Hubo un error subiendo los archivos adjuntos',
                error: error.message || error
            })
        }
    },

    async getStudentAssigmentStatus(req, res, next){
        try {
            const assigment = req.params.assigment;
            const person_id = req.params.person_id;

            const data = await HomeworkModel.getAssigmentStatus(assigment, person_id);

            return res.status(201).json({
                success: true,
                message: 'Estado de la entrega de la asignacion obtenido con exito',
                data: data
            })

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Hubo un error obteniendo tus calificaones de la asignacion',
                error: error.message || error
            })
        }
    }

}