const authRouter = require("express").Router()
const authController = require('../controllers/auth.controller')


authRouter.use('/login', authController.login)

module.exports = authRouter