const customerRouter = require('express').Router();

customerRouter.use('/transfer', require('./transfer.router'))
customerRouter.use('/profile', require('./profiles.router'))
customerRouter.use('/change-password', require('./changePassword.router'))
customerRouter.use('/enter-pin', require('./enterPin.router'))
customerRouter.use('/deposit', require('./deposit.router'))
customerRouter.use("/contact-list", require("./contactList.router"))
customerRouter.use("/history-transaction", require("./historyTransactions.router"))
customerRouter.use("/wallet", require("./wallet.router"))

module.exports = customerRouter