const fs = require('fs');
const path = require('path');
const LocationModel = {};

LocationModel.getCountries = async () => {

    const filePath = path.join(__dirname, '../../utils/locationHelper/countries.json');
    return new Promise(async(resolve, reject) => {
        fs.readFile(filePath, 'utf-8', (err, data) => {

            if(err){
                reject(err);
                return;
            }

            try {
                
                const jsonData = JSON.parse(data);

                const formattedData = jsonData.map(country => ({
                    country_name: country.name,
                    country_short_name: country.iso2,
                    country_phone_code: parseInt(country.phone_code)
                }));

                resolve(formattedData);

            } catch (parseError) {
                reject(parseError);
            }
        })
    });
}

LocationModel.getStates = async (countryName) => {
    const filePath = path.join(__dirname, '../../utils/locationHelper/states.json');
    return new Promise(async(resolve, reject) => {
        fs.readFile(filePath, 'utf-8', (err, data) => {
            if(err){
                reject(err);
                return;
            }
            try {
                
                const jsonData = JSON.parse(data);
                const filteredStates = jsonData
                    .filter(state => state.country_name === countryName)
                    .map(state => ({ state_name: state.name }));

                resolve(filteredStates);
            } catch (parseError) {
                reject(parseError);
            }
        })
    })
}


LocationModel.getCities = async (stateName) => {
    const filePath = path.join(__dirname, '../../utils/locationHelper/cities.json');
    return new Promise(async (resolve, reject) => {
        fs.readFile(filePath, 'utf-8', (err, data) => {
            if(err){
                reject(err);
                return;
            }
            try {
                const jsonData = JSON.parse(data);
                const filteredCities = jsonData
                    .filter(citie => citie.state_name === stateName)
                    .map(citie => ({city_name: citie.name}));

                resolve(filteredCities);
            } catch (parseError) {
                reject(parseError);
            }
        })
    })
}

module.exports = LocationModel;