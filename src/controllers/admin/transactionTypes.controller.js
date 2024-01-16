const transactionTypesModel = require('../../models/transactionTypes.model')

// hendle semua error yg terjadi di catch
const handleErr = require("../../helpers/utils")


// SELECT *
exports.getAllData = async(req, res) => {
    try{
        const getTransactionTypes = await transactionTypesModel.allTransactionTypes()
    
        return res.json({
            success: true,
            message: 'List all Transaction Types!',
            results:getTransactionTypes
        })
    } catch(err){
        handleErr.outError(err, res)
    }
}


// SELECT * BY id
exports.getDataById = async(req, res) => {
    try{
        const idTransactionTypes = Number(req.params.id)
        const transactionTypesbyid = await transactionTypesModel.idTransactionTypes(idTransactionTypes)
        
        if(!transactionTypesbyid){
            throw ({code: "THROW", message: "Transaction Types Data by id Not Found!"})
        }
        
        return res.json({
            success: true,
            message: 'Detail Transaction Types',
            results:transactionTypesbyid
        })

    } catch(err){
        handleErr.outError(err, res)
    }
}


// CREATE
exports.createData = async(req, res) => {
    try{
        const {name} = req.body
        const checkData = await transactionTypesModel.checkData(name)
        if(checkData){
            throw ({code: "THROW", message: "Data is all ready!"})
        }
        
        const transactionTypesnew = await transactionTypesModel.createTransactionTypes(name)
        return res.json({
            success: true,
            message: 'Success add new Transaction Type',
            results:transactionTypesnew
        })

    } catch(err){
        handleErr.outError(err, res)
    }
}


// UPDATE
exports.updateData = async(req, res) => {
    try{
        const idData = Number(req.params.id)
        const {name} = req.body
        const cekData = await transactionTypesModel.idTransactionTypes(idData)
        if(!cekData){
            throw ({code: "THROW", message: "Data is not found!"})
        }

        const updateTransactionTypes = await transactionTypesModel.updateTransactionTypes(
            idData, 
            name
        )

        return res.json({
            success: true,
            message: 'Success add new Transaction Type',
            results: updateTransactionTypes
        })

    } catch(err){
        handleErr.outError(err, res)
    }
}


// DELETE
exports.deleteData = async(req,res) => {
    try{
        const idData = Number(req.params.id)
        const cekData = await transactionTypesModel.idTransactionTypes(idData)
        if(!cekData){
            throw ({code: "THROW", message: "Data is not found!"})
        }

        const deleteData = await transactionTypesModel.deleteTransactionTypes(idData)

        return res.json({
            success: true,
            message: 'Success delete data!',
            results: deleteData
        })
    } catch(err){
        handleErr.outError(err, res)
    }
}