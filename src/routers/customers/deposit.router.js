const depositRouter = require('express').Router()
const depositController = require('../../controllers/customers/deposit.controller')

depositRouter.get('/', depositController.getAll)
depositRouter.post('/', depositController.deposit)

module.exports = depositRouter