const testimonyRouter = require('express').Router()

// controller
const testimonyController = require('../../controllers/admin/testimony.controller')


// end point
testimonyRouter.get('/', testimonyController.getAllData)
testimonyRouter.get('/:id', testimonyController.getDataById)
testimonyRouter.post('/', testimonyController.createData)
testimonyRouter.patch('/:id', testimonyController.updateData)
testimonyRouter.delete('/:id', testimonyController.deleteData)


module.exports = testimonyRouter