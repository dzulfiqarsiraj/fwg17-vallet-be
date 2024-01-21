const historyTransactionsModel = require("../../models/historyTransactions.model")

// hendle semua error yg terjadi di catch
const handleErr = require("../../helpers/utils")


// SELECT *
exports.getAllData = async(req, res) => {
    try{
        const {id} = req.user
        const { filter = '', page = 1, limits = 9 } = req.query
        const countData = await historyTransactionsModel.countData(id, filter)
        if(countData == 0){
            throw ({code: "THROW", message: "No Data!"})
        }

        const getContactList = await historyTransactionsModel.allHistoryTransactions(id, filter, page, limits)
        
        if(getContactList.length < 1){
            throw ({code: "THROW", message: "No Data!"})
        }

        const totalPage = Math.ceil(countData / limits)
        const nextPage = Number(page) + 1
        const prevPage = Number(page) - 1

        return res.json({
            success: true,
            message: 'List all History Transactions!',
            pageInfo: {
                currentPage: Number(page),
                totalPage,
                nextPage: nextPage <= totalPage ? nextPage : null,
                prevPage: prevPage >= 1 ? prevPage : null,
                totalData: Number(countData)
            },
            results: getContactList
        })

    } catch(err){
        handleErr.outError(err, res)
    }
}