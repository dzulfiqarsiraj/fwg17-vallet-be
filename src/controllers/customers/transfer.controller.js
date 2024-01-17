const transferModel = require('../../models/transfer.model')
const walletModel = require('../../models/wallet.model')
const handleErr = require('../../helpers/utils')
const db = require("../../lib/db.lib")

exports.createTransfer = async (req, res) => {
  try{
    await db.query('BEGIN')
    //insert table transfer
    const transfer = await transferModel.insert(req.body)

    // take out balance from sender
    const findWalletSender = await walletModel.findOneByUserId(transfer.senderId)

    if(transfer.amount > findWalletSender.balance){
      throw ({code: 'THROW', message: 'balance is not sufficient'})
    }
    
    const totalSender = findWalletSender.balance - transfer.amount

    const senderWallet = await walletModel.updateTransfer(transfer.senderId, totalSender)

    //add balance to recipient
    const findWalletRecipient = await walletModel.findOneByUserId(transfer.recipientId)

    const totalRecipient = transfer.amount + findWalletRecipient.balance

    const recipientwallet = await walletModel.updateTransfer(transfer.recipientId, totalRecipient)

    
    
    
    if(!req.body.amount){
      throw ({code: 'THROW', message: 'Amount must not be empty'})
    }
    
    if(!req.body.recipientId){
      throw ({code: 'THROW', message: 'Recipient Id must not be empty'})
    }
    
    await db.query('COMMIT')

    return res.json({
      succes: true,
      message: 'Create Transfer Successfully',
      results: transfer
    })
  }catch(err){
    await db.query('ROLLBACK')
    handleErr.outError(err, res)
  }
}