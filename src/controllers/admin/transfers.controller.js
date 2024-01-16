const transferModel = require('../../models/transfer.model')
const errorHandler = require('../../helpers/utils')

exports.getAll = async (req, res) => {
  try{
    const transfer = await transferModel.findAll()
    if(!transfer){
        throw ({code: 'THROW', message: 'Transfer Not Found'})
    }

    return res.json({
        succes: true,
        message: 'List All Transfer',
        results: transfer
    })
  }catch(err){
    console.log(err)
    errorHandler.outError(err, res)
  }
}

exports.getDetailTransfer = async (req, res) => {
  try{
    const id = Number(req.params.id)
    const transfer = await transferModel.findOneById(id)
    if(!transfer){
      throw ({code: 'THROW', message: 'No Existing Data'})
    }
    
    return res.json({
      success: true,
      message: 'Detail Transfer',
      results: transfer
    })
  }catch(err){
    errorHandler.outError(err, res)
  }
}

exports.createTransfer = async (req, res) => {
  try{
    const transfer = await transferModel.insert(req.body)

    if(!req.body.amount){
      throw ({code: 'THROW', message: 'Amount must not be empty'})
    }

    if(!req.body.recipientId){
      throw ({code: 'THROW', message: 'Recipient Id must not be empty'})
    }

    return res.json({
      succes: true,
      message: 'Create Transfer Successfully',
      results: transfer
    })
  }catch(err){
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    })
  }
}

exports.updateTransfer = async (req, res) => {
  try{
    const {id} = req.params

    const currentTransfer = await transferModel.findOneById(id)    
    
    if(currentTransfer === undefined){
      throw ({code: 'THROW', message: 'No Existing Data'})
    }

    const transfer = await transferModel.update(id, req.body)

    return res.json({
      success: true,
      message: 'Update Transfer Successfully',
      results: transfer
    })
  }catch(err){
    errorHandler.outError(err, res)
  }
}

exports.deleteTransfer = async (req, res) => {
  try{
    const {id} = req.params

    const currentTransfer = await transferModel.findOneById(id)
    console.log(currentTransfer)

    if(currentTransfer === undefined){
      throw ({code: 'THROW', message: 'No Existing Data'})
    }

    const transfer = await transferModel.delete(id)

    return res.json({
      succes: true,
      message: 'Delete Success',
      results: transfer
    })
  }catch(err){
    errorHandler.outError(err, res)
  }
}