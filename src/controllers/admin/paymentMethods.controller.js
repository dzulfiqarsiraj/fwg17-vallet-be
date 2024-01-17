const paymentMethodModel = require('../../models/paymentMethods.model')
const errorHandler = require('../../helpers/utils')
const fsPromises = require('fs/promises')
const path = require('path')
const uploadMiddleware = require('../../middleware/upload.middleware')
const upload = uploadMiddleware('paymentMethods').single('image')


exports.getAll = async (req, res) => {
    try{
			const paymentMethod = await paymentMethodModel.findAll()
			return res.json({
				success: true,
				message: 'List All Payment Method',
				results: paymentMethod
			})
    }catch(err){
			errorHandler.outError(err, res)
    }

}

exports.getDetailPaymentMethod = async (req, res) => {
	try{
		const id = Number(req.params.id)
		const paymentMethod = await paymentMethodModel.findOneById(id)

		if(!paymentMethod){
			throw ({code: 'THROW', message: 'No Existing Data'})
		}
		return res.json({
			success: true,
			message: 'Detail Payment Method',
			results: paymentMethod
		})
	}catch(err){
		errorHandler.outError(err, res)
	}
}

exports.createPaymentMethod = async (req, res) => {
	upload(req, res, async (err) => {
		try{
			if(err){
				throw err
			}

			if(!req.body.name){
				throw ({code: 'THROW', message: 'Name must not be empty'})
			}

			if(req.file){
				req.body.image = req.file.filename
			}
			const paymentMethod = await paymentMethodModel.insert(req.body)
			
			if(req.file){
				const extension = {
			'image/png' : '.png',
			'image/jpg' : '.jpg',
			'image/jpeg' : '.jpeg',
			}

				const uploadLocation = path.join(global.path, 'uploads','paymentMethods')
				const fileLocation = path.join(uploadLocation, req.file.filename)
				const fileName = `${paymentMethod.id}${extension[req.file.mimetype]}`
				const newLocation = path.join(uploadLocation, fileName)

				await fsPromises.rename(fileLocation, newLocation)
				const renamedPaymentMethod = await paymentMethodModel.updateImageForCreate(paymentMethod.id, {
					image: fileName
				})
		
				return res.json({
					success: true,
					message: 'Create Payment Method Successfully',
					results: renamedPaymentMethod
				})
			}
		}catch(err){
			errorHandler.outError(err, res)
		}
	})
}

exports.updatePaymentMethod = async (req, res) => {
	try{
		const {id} = req.params

		const currentPaymentMethod = await paymentMethodModel.findOneById(id)

		if(currentPaymentMethod === undefined){
			throw ({code: 'THROW', message: 'No Existing Data'})
		}

		const paymentMethod = await paymentMethodModel.update(id, req.body)
		return res.json({
			success: true,
			message: 'Update Payment Method Successfully',
			results: paymentMethod
		})
	}catch(err){
		errorHandler.outError(err, res)
	}
}

exports.deletePaymentMethod = async (req, res) => {
	try{
		const {id} = req.params

		const currentPaymentMethod = await paymentMethodModel.findOneById(id)

		if(currentPaymentMethod === undefined){
			throw ({code: 'THROW', message: 'No Existing Data'})
		}

		const paymentMethod = await paymentMethodModel.delete(id)

		return res.json({
			success: true,
			message: 'Delete Success',
			results: paymentMethod
		})
	}catch(err){
		errorHandler.outError(err, res)
	}
}