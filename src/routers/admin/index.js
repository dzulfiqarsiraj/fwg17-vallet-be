const adminRouter = require('express').Router()

adminRouter.use('/roles', require('./roles.router'))
adminRouter.use('/users', require('./users.router'))
adminRouter.use('/wallet', require('./wallet.router'))

module.exports = adminRouter