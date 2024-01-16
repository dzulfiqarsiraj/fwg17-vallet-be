const adminRouter = require('express').Router()

adminRouter.use('/roles', require('./roles.router'))
adminRouter.use('/users', require('./users.router'))
adminRouter.use('/contact-list', require('./contactList.router'))
adminRouter.use('/wallet', require('./wallet.router'))
adminRouter.use('/transaction-types', require('./transactionTypes.router'))
adminRouter.use('/transfer', require('./transfers.router'))
adminRouter.use('/payment-methods', require('./paymentMethods.router'))
adminRouter.use('/testimony', require('./testimony.router'))
adminRouter.use('/transactions', require('./transactions.router'))

module.exports = adminRouter