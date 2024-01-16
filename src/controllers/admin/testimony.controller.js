const testimonyModel = require('../../models/testimony.model')

// hendle semua error yg terjadi di catch
const handleErr = require("../../helpers/utils")


// SELECT *
exports.getAllData = async(req, res) => {
    try{
        const getTestimony = await testimonyModel.allTestimony()
    
        return res.json({
            success: true,
            message: 'List all Testimony',
            results:getTestimony
        })
    } catch(err){
        handleErr.outError(err, res)
    }
}


// SELECT * BY id
exports.getDataById = async(req, res) => {
    try{
        const idTestimony = Number(req.params.id)
        const testimonybyid = await testimonyModel.idTestimony(idTestimony)
        
        if(!testimonybyid){
            throw ({code: "THROW", message: "Testimony Data by id Not Found!"})
        }
        
        return res.json({
            success: true,
            message: 'Detail Testimony!',
            results:testimonybyid
        })

    } catch(err){
        handleErr.outError(err, res)
    }
}


// CREATE
exports.createData = async(req, res) => {
    try{
        const { userId } = req.body
        const testimonynew = await testimonyModel.createTestimony(userId, req.body)
        return res.json({
            success: true,
            message: 'Success add new Testimony!',
            results:testimonynew
        })

    } catch(err){
        handleErr.outError(err, res)
    }
}


// UPDATE
exports.updateData = async(req, res) => {
    try{
        const idData = Number(req.params.id)
        const { rating, review } = req.body
        const cekData = await testimonyModel.idTestimony(idData)
        if(!cekData){
            throw ({code: "THROW", message: "Data Testimony is not found!"})
        }

        const updateTestimony = await testimonyModel.updateTestimony(
            idData, 
            rating,
            review
        )

        return res.json({
            success: true,
            message: 'Success add new Testimony!',
            results: updateTestimony
        })

    } catch(err){
        handleErr.outError(err, res)
    }
}

// DELETE
exports.deleteData = async(req,res) => {
    try{
        const idData = Number(req.params.id)
        const cekData = await testimonyModel.idTestimony(idData)
        if(!cekData){
            throw ({code: "THROW", message: "Data is not found!"})
        }

        const deleteData = await testimonyModel.deleteTestimony(idData)

        return res.json({
            success: true,
            message: 'Success delete data!',
            results: deleteData
        })
    } catch(err){
        handleErr.outError(err, res)
    }
}