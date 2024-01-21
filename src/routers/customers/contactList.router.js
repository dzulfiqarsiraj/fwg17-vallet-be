const contactListRouter = require("express").Router()

// controller
const contactListController = require('../../controllers/customers/contactList.controller') 

// end point
contactListRouter.get('/', contactListController.getAllData)
contactListRouter.get('/:id', contactListController.getDetailTransfer)

module.exports = contactListRouter