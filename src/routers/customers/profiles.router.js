const profileRouter = require("express").Router()
const profileController = require('../../controllers/customers/profiles.controller')

const uploadMiddleware = require('../../middleware/upload.middleware')
const multerErrorHandler = require('../../middleware/multerErrorHandler.middleware')

profileRouter.get('/', profileController.getProfile)
profileRouter.patch('/',
    uploadMiddleware("users").single("picture"),
    multerErrorHandler,
    profileController.updateProfile
)

module.exports = profileRouter