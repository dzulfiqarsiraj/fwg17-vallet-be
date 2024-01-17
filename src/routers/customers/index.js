const customerRouter = require('express').Router();

// end point
customerRouter.use('/deposit', require('./deposit.router'))

module.exports = customerRouter