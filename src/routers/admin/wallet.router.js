const walletRouter = require('express').Router()

const walletController = require('../../controllers/admin/wallet.controller')

walletRouter.get('/', walletController.getAll)
walletRouter.get('/:id', walletController.getDetailWallet)
walletRouter.post('/', walletController.createWallet)
walletRouter.patch('/:id', walletController.updateWallet)
walletRouter.delete('/:id', walletController.deleteWallet)

module.exports = walletRouter
