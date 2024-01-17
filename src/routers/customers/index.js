const customerRouter = require("express").Router();

customerRouter.use('/transfer', require('./transfer.router'))
customerRouter.use('/profile', require('./profiles.router'))
customerRouter.use('/change-password', require('./changePassword.router'))
customerRouter.use('/enter-pin', require('./enterPin.router'))

module.exports = customerRouter