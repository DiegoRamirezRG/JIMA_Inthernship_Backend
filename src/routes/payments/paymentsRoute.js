const PaymentsController = require('../../controllers/payments/paymentsController');
const middleware = require('../../middleware/jwtValidatorMiddleware');

module.exports = (app) => {

    app.get('/api/payments/getAllPayments', middleware, PaymentsController.getAllPayments);
    app.get('/api/payments/standByPayments', middleware, PaymentsController.getAllStanByPayments);

    app.post('/api/payments/createBasicPayments', middleware, PaymentsController.createAllPayment);
    app.post('/api/payments/createPayment', middleware, PaymentsController.createPayment);
    app.post('/api/payment/chargePayment', middleware, PaymentsController.chargePaymentToStudent);

    app.put('/api/payments/updatePayment', middleware, PaymentsController.updatePaymentCostObj);
    app.put('/api/payments/markAsPayed', middleware, PaymentsController.markAsPayed);

    app.delete('/api/payment/deletePayment/:person_payment_id', middleware, PaymentsController.deletePayment);

}