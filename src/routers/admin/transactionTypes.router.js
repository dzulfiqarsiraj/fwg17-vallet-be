const transactionTypesRouter = require('express').Router()

// controller
const transactionTypesController = require('../../controllers/admin/transactionTypes.controller')


// end point
transactionTypesRouter.get('/', transactionTypesController.getAllData)
transactionTypesRouter.get('/:id', transactionTypesController.getDataById)
transactionTypesRouter.post('/', transactionTypesController.createData)
transactionTypesRouter.patch('/:id', transactionTypesController.updateData)
transactionTypesRouter.delete('/:id', transactionTypesController.deleteData)


module.exports = transactionTypesRouter