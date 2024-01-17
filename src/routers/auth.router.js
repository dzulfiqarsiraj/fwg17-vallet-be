const authRouter = require("express").Router()
const authController = require('../controllers/auth.controller')


authRouter.use('/login', authController.login)
authRouter.use('/register', authController.register)
authRouter.use('/transfer/:id', authController.verifyPin)

module.exports = authRouter