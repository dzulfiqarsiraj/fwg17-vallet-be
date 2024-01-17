const customerRouter = require('express').Router();

// end point
customerRouter.use('/deposit', require('./deposit.router'))
customerRouter.use("/contact-list", require("./contactList.router"))

module.exports = customerRouter