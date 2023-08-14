const UsersHelpers = {};

UsersHelpers.organizeWhere = (nombre, rol, grado, grupo, turno) => {
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

    return organizedWhere;
}

module.exports = UsersHelpers;