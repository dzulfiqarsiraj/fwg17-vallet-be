const transferRouter = require('express').Router()
const transferController = require('../../controllers/admin/transfers.controller')

transferRouter.get('/', transferController.getAll)
transferRouter.get('/:id', transferController.getDetailTransfer)
transferRouter.post('/', transferController.createTransfer)
transferRouter.patch('/:id', transferController.updateTransfer)
transferRouter.delete('/:id', transferController.deleteTransfer)

module.exports = transferRouter