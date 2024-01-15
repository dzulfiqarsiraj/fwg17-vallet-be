const adminRouter = require('express').Router()

adminRouter.use('/roles', require('./roles.router'))
adminRouter.use('/users', require('./users.router'))

module.exports = adminRouter