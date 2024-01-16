const contactListRouter = require('express').Router()

const contactListController = require('../../controllers/admin/contactList.controller')

contactListRouter.get('/', contactListController.getAll)
contactListRouter.get('/:id', contactListController.detail)
contactListRouter.post('/', contactListController.create)
contactListRouter.patch('/:id', contactListController.update)
contactListRouter.delete('/:id', contactListController.delete)

module.exports = contactListRouter