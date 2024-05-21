const authRouter = require("express").Router()
const authController = require('../controllers/auth.controller')


authRouter.use('/login', authController.login)
authRouter.use('/register', authController.register)
authRouter.use('/transfer/:id', authController.verifyPin)
authRouter.use('/verify-password/:id', authController.verifyPassword)
authRouter.use('/verify-pin/:id', authController.verifyPin)
authRouter.post('/forgot-password', authController.forgotPassword)
authRouter.post('/forgot-pin', authController.forgotPin)
authRouter.get('/find-user-by-email', authController.findUserByEmail)
authRouter.get('/find-user-by-phone', authController.findUserByPhone)

module.exports = authRouter