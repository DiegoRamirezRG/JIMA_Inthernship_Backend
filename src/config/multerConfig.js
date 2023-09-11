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

module.exports = {
    user_profile_bucket
}