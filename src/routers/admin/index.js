const adminRouter = require('express').Router()

adminRouter.use('/roles', require('./roles.router'))
adminRouter.use('/users', require('./users.router'))
adminRouter.use('/transaction-types', require('./transactionTypes.router'))

module.exports = adminRouter