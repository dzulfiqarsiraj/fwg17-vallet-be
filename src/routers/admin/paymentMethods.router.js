const paymentMethodRouter = require('express').Router()
const paymentMethodController = require('../../controllers/admin/paymentMethods.controller')

paymentMethodRouter.get('/', paymentMethodController.getAll)
paymentMethodRouter.get('/:id', paymentMethodController.getDetailPaymentMethod)
paymentMethodRouter.post('/', paymentMethodController.createPaymentMethod)
paymentMethodRouter.patch('/:id', paymentMethodController.updatePaymentMethod)
paymentMethodRouter.delete('/:id', paymentMethodController.deletePaymentMethod)

module.exports = paymentMethodRouter