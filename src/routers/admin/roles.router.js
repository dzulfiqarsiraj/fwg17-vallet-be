const rolesRouter = require('express').Router()

const rolesController = require('../../controllers/admin/roles.controller')

rolesRouter.get('/', rolesController.getAll)
rolesRouter.get('/:id', rolesController.detail)
rolesRouter.post('/', rolesController.create)
rolesRouter.patch('/:id', rolesController.update)
rolesRouter.delete('/:id', rolesController.delete)

module.exports = rolesRouter