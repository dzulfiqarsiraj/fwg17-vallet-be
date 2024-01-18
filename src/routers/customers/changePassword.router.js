const changePasswordRouter = require("express").Router()
const changePasswordController = require('../../controllers/customers/changePassword.controller')

changePasswordRouter.patch('/:id', changePasswordController.updatePassword)

module.exports = changePasswordRouter