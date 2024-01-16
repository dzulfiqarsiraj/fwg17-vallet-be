const router = require("express").Router()
const authMiddleware = require('../middleware/auth.middleware')
const roleCheckMiddleware = require('../middleware/roleCheck.middleware')

// End Point untuk cek Auth
// router.use("/auth", require("./auth.router"))
router.use('/admin', authMiddleware, roleCheckMiddleware('admin'), require('./admin'))
router.use('/auth', require('./auth.router'))

module.exports = router