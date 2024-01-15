const adminRouter = require('express').Router()

adminRouter.use('/roles', require('./roles.router'))
adminRouter.use('/users', require('./users.router'))
adminRouter.use('/contact-list', require('./contactList.router'))

module.exports = adminRouter