const path = require('path');
const fs = require('fs');
const StudentModel = require('../../models/students/studentsModel');

module.exports = {
        
    async downloadATeacherAttachedFile(req, res, next){
        try {
            const assign_id = req.params.assign_id;
            const file_name = req.params.file_name;
            
            const homeworkFile =  path.join(__dirname, `../../global/storage/assigmentFiles/${assign_id}/${file_name}`);

            fs.access(homeworkFile, fs.constants.F_OK, (err) => {
                if (err) {
                    return res.status(404).json({
                        success: false,
                        message: 'El archivo no existe o esta corrupto',
                        error: err
                    })
                }

                return res.download(homeworkFile, (err) => {
                    if(err){
                        console.error('Error downloading file:', err);
                        throw new Error('Error al descargar el archivo')
                    }
                })
            })

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Hubo un error al descargar el archivo',
                error: error.message || error
            })
        }
    },

    async downloadStudentAttachedFilesByName(req, res, next){
        try {
            const assign_id = req.params.assign_id;
            const person_id = req.params.person_id;
            const file_name = req.params.file_name;

            const studentId = await StudentModel.getStudentIdByPersonId(person_id);

            const homeworkFile =  path.join(__dirname, `../../global/storage/assigmentFiles/${assign_id}/turned/${studentId}/${file_name}`);

            fs.access(homeworkFile, fs.constants.F_OK, (err) => {
                if(err){
                    return res.status(404).json({
                        success: false,
                        message: 'El archivo no existe o esta corrupto',
                        error: err
                    })
                }

                return res.download(homeworkFile, (err) => {
                    if(err){
                        console.error('Error downloading file:', err);
                        throw new Error('Error al descargar el archivo');
                    }
                })
            })

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Hubo un error al descargar el archivo',
                error: error.message || error
            })
        }
    }

}