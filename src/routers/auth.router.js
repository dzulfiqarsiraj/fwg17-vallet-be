const authRouter = require("express").Router()
const authController = require('../controllers/auth.controller')


authRouter.use('/login', authController.login)
authRouter.use('/register', authController.register)

module.exports = authRouter