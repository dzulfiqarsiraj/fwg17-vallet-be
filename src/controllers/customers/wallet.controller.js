const walletModel = require('../../models/wallet.model')
const errorHandler = require('../../helpers/utils')

exports.getDetailWallet = async (req, res) => {
  try{
    const id = Number(req.params.id)
    const wallet = await walletModel.findOneByUserId(id)

    if(!wallet){
      throw ({code: 'THROW', message: 'Wallet Not Found'})
    }

    return res.json({
      succes: true,
      message: 'Detail Wallet',
      results: wallet
    })
  }catch(err){
    errorHandler.outError(err,res)
  }
}