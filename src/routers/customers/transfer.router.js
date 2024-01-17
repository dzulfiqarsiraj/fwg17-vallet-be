const transferRouter = require('express').Router()

const transferController = require('../../controllers/customers/transfer.controller')

transferRouter.post('/', transferController.createTransfer)

module.exports = transferRouter