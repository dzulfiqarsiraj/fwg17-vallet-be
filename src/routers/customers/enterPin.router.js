const enterPinRouter = require("express").Router()
const enterPinController = require('../../controllers/customers/enterPin.controller')

enterPinRouter.patch('/', enterPinController.updatePin)

module.exports = enterPinRouter