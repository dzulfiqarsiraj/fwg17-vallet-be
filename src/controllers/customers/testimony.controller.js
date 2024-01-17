const testimonyModel = require('../../models/testimony.model')

// hendle semua error yg terjadi di catch
const handleErr = require("../../helpers/utils")


// SELECT *
exports.getAllData = async(req, res) => {
    try{
        const { filter, sortby, order, page = 1, limits = 6 } = req.query
        const countData = await testimonyModel.countData(filter)

        const getTestimony = await testimonyModel.allTestimony(
            filter,
            sortby,
            order,
            page,
            limits
        )

        if(getTestimony.length < 1){
            throw ({code: "THROW", message: "No Data!"})
        }

        const totalPage = Math.ceil(countData / limits)
        const nextPage = Number(page) + 1
        const prevPage = Number(page) - 1
    
        return res.json({
            success: true,
            message: 'List all Testimony',
            pageInfo: {
                currentPage: Number(page),
                totalPage,
                nextPage: nextPage <= totalPage ? nextPage : null,
                prevPage: prevPage >= 1 ? prevPage : null,
                totalData: Number(countData)
            },
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