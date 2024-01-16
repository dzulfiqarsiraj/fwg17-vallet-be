const transactionsModel = require('../../models/transactions.model')

// hendle semua error yg terjadi di catch
const handleErr = require("../../helpers/utils")


// SELECT *
exports.getAllData = async(req, res) => {
    try{
        const { sortby, order, page = 1, limits = 6 } = req.query
        const countData = await transactionsModel.countData()

        const getTransactions = await transactionsModel.allTransactions(
            sortby,
            order,
            page,
            limits
        )

        if(getTransactions.length < 1){
            throw ({code: "THROW", message: "No Data!"})
        }

        const totalPage = Math.ceil(countData / limits)
        const nextPage = Number(page) + 1
        const prevPage = Number(page) - 1

        return res.json({
            success: true,
            message: 'List all data Transactions!',
            pageInfo: {
                currentPage: Number(page),
                totalPage,
                nextPage: nextPage <= totalPage ? nextPage : null,
                prevPage: prevPage >= 1 ? prevPage : null,
                totalData: Number(countData)
            },
            results: getTransactions
        })
    } catch(err){
        handleErr.outError(err, res)
    }
}


// SELECT * BY id
exports.getDataById = async(req, res) => {
    try{
        const idTransactions = Number(req.params.id)
        const transactionsbyid = await transactionsModel.idTransaction(idTransactions)
        
        if(!transactionsbyid){
            throw ({code: "THROW", message: "Transactions Data by id Not Found!"})
        }
        
        return res.json({
            success: true,
            message: 'Detail Transactions!',
            results: transactionsbyid
        })

    } catch(err){
        handleErr.outError(err, res)
    }
}


// CREATE
exports.createData = async(req, res) => {
    try{
        const { walletId } = req.body
        const transactionsnew = await transactionsModel.createTransactions(walletId, req.body)
        return res.json({
            success: true,
            message: 'Success add new Transacions!',
            results: transactionsnew
        })

    } catch(err){
        handleErr.outError(err, res)
    }
}


// UPDATE
exports.updateData = async(req, res) => {
    try{
        const idData = Number(req.params.id)
        const cekData = await transactionsModel.idTransaction(idData)
        if(!cekData){
            throw ({code: "THROW", message: "Data Transactions is not found!"})
        }

        const updateTransactions = await transactionsModel.updateTransactions(
            idData, 
            req.body
        )

        return res.json({
            success: true,
            message: 'Success add new Transactions!',
            results: updateTransactions
        })

    } catch(err){
        handleErr.outError(err, res)
    }
}


// DELETE
exports.deleteData = async(req,res) => {
    try{
        const idData = Number(req.params.id)
        const cekData = await transactionsModel.idTransaction(idData)
        if(!cekData){
            throw ({code: "THROW", message: "Data Transactions is not found!"})
        }

        const deleteData = await transactionsModel.deleteTransactions(idData)

        return res.json({
            success: true,
            message: 'Success delete data Transactions!',
            results: deleteData
        })
    } catch(err){
        handleErr.outError(err, res)
    }
}