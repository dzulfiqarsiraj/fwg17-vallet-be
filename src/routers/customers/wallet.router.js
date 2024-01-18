const walletRouter = require("express").Router()

const walletController = require('../../controllers/customers/wallet.controller')

walletRouter.get('/:id', walletController.getDetailWallet)

module.exports = walletRouter