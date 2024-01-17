const walletModel = require('../../models/wallet.model')
const transactionTypeModel = require('../../models/transactionTypes.model')
const transactionModel = require('../../models/transactions.model')
const db = require('../../lib/db.lib')
const errorHandler = require('../../helpers/utils')

exports.deposit = async (req, res) => {
    try{
      await db.query('BEGIN')
      const {id} = req.user
      console.log(req.user)

      // GET WALLET ID BY USER ID
      const walletId = await walletModel.findOneByUserId(id)

      // ENTER DATA TO TRANSACTION
      const transaction = await transactionModel.createTransactions(walletId.id, {...req.body,
        transactionTypeId: 1
      })

      const totalBalance = walletId.balance + transaction.amount

      const wallet = await walletModel.updateByUserId(id, totalBalance)

      await db.query('COMMIT')

      return res.json({
        success: true,
        message: 'Top Up Success',
        results: transaction
      })
    }catch(err){
      await db.query('ROLLBACK')
      errorHandler.outError(err, res)
    }
}