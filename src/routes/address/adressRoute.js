
const middleware = require('../../middleware/jwtValidatorMiddleware');
const AddressController = require('../../controllers/address/addressController');

module.exports = (app) => {
    
    app.get('/api/address/getAddress/:userId', middleware, AddressController.getAddressById);

}