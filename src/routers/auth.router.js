const authRouter = require("express").Router()
const authController = require('../controllers/auth.controller')


authRouter.use('/login', authController.login)
authRouter.use('/register', authController.register)
authRouter.use('/transfer/:id', authController.verifyPin)
authRouter.use('/verify-password/:id', authController.verifyPassword)
authRouter.post('/forgot-password', authController.forgotPassword)
authRouter.post('/forgot-pin', authController.forgotPin)

module.exports = authRouter