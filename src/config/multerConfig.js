const path = require('path');
const multer = require('multer');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const rootDirectory = path.resolve(__dirname, '../');
const user_profiles = '/global/storage/user_profiles/';

const user_profile_bucket = async (id) => {
    return new Promise((resolve, reject) => {
        if(!fs.existsSync(rootDirectory+user_profiles+id)){
            fs.mkdir(rootDirectory+user_profiles+id, (err) => {
                if(err){
                    console.error(`Error creating directory: ${rootDir+pathDir+path}. Error: ${err}`);
                    reject(err);
                }else{
                    const storage = multer.diskStorage({
                        destination: function(req, file, cb){
                            cb(null, rootDirectory+user_profiles+id)
                        },
                        filename: function(req, file, cb){
                            const fileExt = path.extname(file.originalname);
                            cb(null, uuidv4() + fileExt);
                        }
                    });
                    resolve(storage);
                }
            });
        }else{
            const storage = multer.diskStorage({
                destination: function(req, file, cb){
                    cb(null, rootDirectory+user_profiles+id)
                },
                filename: function(req, file, cb){
                    const fileExt = path.extname(file.originalname);
                    cb(null, uuidv4() + fileExt);
                }
            });
            resolve(storage);
        }
    })
}

const assigment_files = '/global/storage/assigmentFiles/';

const assigment_files_bucket = async (id) => {
    return new Promise((resolve, reject) => {
        if(!fs.existsSync(rootDirectory+assigment_files+id)){
            fs.mkdir(rootDirectory+assigment_files+id, (err) => {
                if(err){
                    console.error(`Error creating directory: ${rootDir+pathDir+path}. Error: ${err}`);
                    reject(err);
                }else{
                    const storage = multer.diskStorage({
                        destination: function(req, file, cb){
                            cb(null, rootDirectory+assigment_files+id)
                        },
                        filename: function(req, file, cb){
                            cb(null, file.originalname);
                        }
                    });
                    resolve(storage);
                }
            });
        }else{
            const storage = multer.diskStorage({
                destination: function(req, file, cb){
                    cb(null, rootDirectory+assigment_files+id)
                },
                filename: function(req, file, cb){
                    cb(null, file.originalname);
                }
            });
            resolve(storage);
        }
    })
}

const student_asigmnet_bucket = async (assign_id, student_id) => {
    return new Promise((resolve, reject) => {
        if(!fs.existsSync(rootDirectory+assigment_files+assign_id+'/turned/'+student_id)){
            fs.mkdir(rootDirectory+assigment_files+assign_id+'/turned/'+student_id, { recursive: true }, (err) => {
                if(err){
                    console.error(`Error creating directory: ${rootDirectory+assigment_files+assign_id+'/turned/'+student_id}. Error: ${err}`);
                    reject(err);
                }else{
                    const storage = multer.diskStorage({
                        destination: function(req, file, cb){
                            cb(null, rootDirectory+assigment_files+assign_id+'/turned/'+student_id);
                        },
                        filename: function(req, file, cb){
                            cb(null, file.originalname);
                        }
                    });
                    resolve(storage);
                }
            });
        }else{
            const storage = multer.diskStorage({
                destination: function(req, file, cb){
                    cb(null, rootDirectory+assigment_files+assign_id+'/turned/'+student_id);
                },
                filename: function(req, file, cb){
                    cb(null, file.originalname);
                }
            });
            resolve(storage);
        }
    })
}

const wallpaper_files = '/global/storage/user_wallpapers/';

const user_wallpaper_bucket = async (id) => {
    return new Promise((resolve, reject) => {
        if(!fs.existsSync(rootDirectory+wallpaper_files+id)){
            fs.mkdir(rootDirectory+wallpaper_files+id, { recursive: true }, (err) => {
                if(err){
                    console.error(`Error creating directory: ${rootDirectory+assigment_files+assign_id+'/turned/'+student_id}. Error: ${err}`);
                    reject(err);
                }else{
                    const storage = multer.diskStorage({
                        destination: function(req, file, cb){
                            cb(null, rootDirectory+wallpaper_files+id);
                        },
                        filename: function(req, file, cb){
                            cb(null, 'wallpaper_profile.jpg');
                        }
                    });
                    resolve(storage)
                }
            })
        }else{
            const storage = multer.diskStorage({
                destination: function(req, file, cb){
                    cb(null, rootDirectory+wallpaper_files+id);
                },
                filename: function(req, file, cb){
                    cb(null, 'wallpaper_profile.jpg');
                }
            });
            resolve(storage);
        }
    })
}

module.exports = {
    user_profile_bucket,
    user_wallpaper_bucket,
    assigment_files_bucket,
    student_asigmnet_bucket
}