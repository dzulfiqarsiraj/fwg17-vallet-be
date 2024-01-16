const transactionsRouter = require('express').Router()

// controller
const transactionsController = require('../../controllers/admin/transactions.controller')


// end point
transactionsRouter.get('/', transactionsController.getAllData)
transactionsRouter.get('/:id', transactionsController.getDataById)
transactionsRouter.post('/', transactionsController.createData)
transactionsRouter.patch('/:id', transactionsController.updateData)
transactionsRouter.delete('/:id', transactionsController.deleteData)


module.exports = transactionsRouter