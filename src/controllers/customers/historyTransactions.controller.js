const historyTransactionsModel = require("../../models/historyTransactions.model")

// hendle semua error yg terjadi di catch
const handleErr = require("../../helpers/utils")


// SELECT *
exports.getAllData = async(req, res) => {
    try{
        const {id} = req.user
        const getContactList = await historyTransactionsModel.allHistoryTransactions(id)
        if(getContactList.length < 1){
            throw ({code: "THROW", message: "No Data!"})
        }

        return res.json({
            success: true,
            message: 'List all History Transactions!',
            results: getContactList
        })

    } catch(err){
        handleErr.outError(err, res)
    }
}