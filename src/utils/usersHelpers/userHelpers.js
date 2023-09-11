const path = require('path');
const fs = require('fs');
const UsersHelpers = {};

UsersHelpers.organizeWhere = (nombre, rol, grado, grupo, turno, id) => {
    let organizedWhere = '';

    if (nombre) {
        organizedWhere += nombre;
    }

    if(rol){
        if(organizedWhere){
            organizedWhere += ' AND ';
        }
        organizedWhere += rol;
    }

    if(grado){
        if(organizedWhere){
            organizedWhere += ' AND ';
        }
        organizedWhere += grado;
    }

    if(grupo){
        if(organizedWhere){
            organizedWhere += ' AND ';
        }
        organizedWhere += grupo;
    }

    if(turno){
        if(organizedWhere){
            organizedWhere += ' AND ';
        }
        organizedWhere += turno;
    }

    if(id){
        if(organizedWhere){
            organizedWhere += ' AND ';
        }
        organizedWhere += `ID_Persona <> "${id}" AND Nombre <> "Admin"`;
    }

    console.log(organizedWhere);
    return organizedWhere;
}

UsersHelpers.deleteImage = (dir) => {
    return new Promise( async (resolve, reject) => {
        try {

            if (!fs.existsSync(dir)) {
                resolve();
                return;
            }

            if(fs.readdirSync(dir).length === 0){
                resolve();
                return;
            }

            fs.readdirSync(dir).forEach((file) => {
                const fileDir = path.join(dir, file);
                if (fs.lstatSync(fileDir).isFile()) {
                    fs.unlinkSync(fileDir);
                }
            });

            const isEmpty = fs.readdirSync(dir).length === 0;

            if (isEmpty) {
                resolve();
            } else {
                reject(new Error('Ocurrio un error eliminando la imagen.'));
            }
        } catch (error) {
            reject(error);
        }
    })
}

module.exports = UsersHelpers;