const PaymentModel = require('../../models/payments/paymentsModel');

module.exports = {
    
    async getAllPayments(req, res, next){
        try {
            const data = await PaymentModel.getAllPayments();

            return res.status(201).json({
                success: true,
                message: 'Servicios obtenidos con exito',
                data: data
            })
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Ha ocurrido un error al obtener los Servicios',
                error: error.message
            })
        }
    },

    async createAllPayment(req, res, next){
        try {
            await PaymentModel.createAutoBasicPayments();

            return res.status(201).json({
                success: true,
                message: 'Servicios creados con exito'
            })
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Ha ocurrido un error al obtener los Servicios',
                error: error.message
            })
        }
    },

    async updatePaymentCostObj(req, res, next){
        try {
            const payment = req.body;
            await PaymentModel.updatePayment(payment);

            return res.status(201).json({
                success: true,
                message: 'Servicio actualizado con exito'
            })
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Ha ocurrido un error al actualizar los datos del Servicio',
                error: error.message
            })
        }
    },

    async createPayment(req, res, next){
        try {
            const payment = req.body;
            await PaymentModel.createNewPayment(payment);

            return res.status(201).json({
                success: true,
                message: 'Servicio creado con exito'
            })
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Ha ocurrido un error al crear el Servicio',
                error: error.message
            })
        }
    },

    async chargePaymentToStudent(req, res, next){
        try {
            const { person_id, payment_id } = req.body;
            await PaymentModel.chargeStudentPayment(person_id, payment_id);

            return res.status(201).json({
                success: true,
                message: 'Se realizo el cargo con exito'
            })
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Ha ocurrido un error al realizar el cargo',
                error: error.message
            })
        }
    },

    async getAllStanByPayments(req, res, next){
        try {
            const data = await PaymentModel.getAllStandByPayments();

            return res.status(201).json({
                success: true,
                message: 'Pagos pendientes obtenidos con exito',
                data: data
            })
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Ha ocurrido un error al obetener los pagos pendientes',
                error: error.message
            })
        }
    },

    async markAsPayed(req, res, next){
        try {
            const { ID_Persona_Coste } = req.body;
            await PaymentModel.markAsPayed(ID_Persona_Coste);

            return res.status(201).json({
                success: true,
                message: 'El cargo se marco como pagado',
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Ha ocurrrido un error al marcar como pagado el cargo',
                error: error.message
            })
        }
    },

    async deletePayment(req, res, next){
        try {
            const person_payment_id = req.params.person_payment_id;
            await PaymentModel.deletePayment(person_payment_id);
            
            return res.status(201).json({
                success: true,
                message: 'El cargo se elimino correctamente',
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Ha ocurrrido un error al eliminar el cargo',
                error: error.message
            })
        }
    }
}