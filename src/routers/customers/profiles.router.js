const profileRouter = require("express").Router()
const profileController = require('../../controllers/customers/profiles.controller')

profileRouter.get('/', profileController.getProfile)

module.exports = profileRouter