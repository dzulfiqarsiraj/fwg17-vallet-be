const usersRouter = require('express').Router()

const usersController = require('../../controllers/admin/users.controller')

usersRouter.get('/', usersController.getAll)
usersRouter.get('/:id', usersController.detail)
usersRouter.post('/', usersController.create)
usersRouter.patch('/:id', usersController.update)
usersRouter.delete('/:id', usersController.delete)

module.exports = usersRouter