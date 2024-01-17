const testimonyRouter = require('express').Router()

// controller
const testimonyController = require('../../controllers/customers/testimony.controller')


// end point
testimonyRouter.get('/', testimonyController.getAllData)


module.exports = testimonyRouter