const router = require("express").Router()

// End Point untuk cek Auth
router.use("/auth", require("./auth.router"))

module.exports = router