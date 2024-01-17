const historyTransactionsRouter = require("express").Router()

// controller
const historyTransactionsController = require("../../controllers/customers/historyTransactions.controller")

// end point
historyTransactionsRouter.get('/', historyTransactionsController.getAllData)

module.exports = historyTransactionsRouter