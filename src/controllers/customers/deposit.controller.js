const walletModel = require('../../models/wallet.model')
const transactionTypeModel = require('../../models/transactionTypes.model')
const transactionModel = require('../../models/transactions.model')
const db = require('../../lib/db.lib')
const errorHandler = require('../../helpers/utils')
const paymentMethodModel = require('../../models/paymentMethods.model')

exports.deposit = async (req, res) => {
    try{
      await db.query('BEGIN')
      const {id} = req.user
      console.log(id)

      // GET WALLET ID BY USER ID
      const walletId = await walletModel.findOneByUserId(id)
      console.log(walletId)

      // ENTER DATA TO TRANSACTION
      const transaction = await transactionModel.createTransactions(walletId.id, {...req.body,
        transactionTypeId: 1, tax: req.body.amount * 1/10
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