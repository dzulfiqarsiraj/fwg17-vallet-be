const walletModel = require('../../models/wallet.model')
const errorHandler = require('../../helpers/utils')

exports.getAll = async (req, res) => {
  try{
    const wallet = await walletModel.findAll()
    console.log(wallet.length)
    if(!wallet){
      throw ({code: 'THROW', message: 'Wallet Not Found'})
    }
    
    return res.json({
      success: true,
      message: 'List All Wallets',
      results: wallet
    })
  }catch{
    errorHandler.outError(err,res)
  }
}

exports.getDetailWallet = async (req, res) => {
  try{
    const id = Number(req.params.id)
    const wallet = await walletModel.findOneById(id)

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

exports.createWallet = async(req, res) => {
  try{
    const {userId} = req.body
    const wallet = await walletModel.insert({
      userId,
      balance: 0
    })

    return res.json({
      success: true,
      message: 'Create Wallet Successfully',
      results: wallet
    })
  }catch(err){
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    })
  }
}

exports.updateWallet = async (req, res) => {
  try{
    const {id} = req.params
    
    const wallet = await walletModel.update(id, {...req.body,
      balance: Number(req.body.balance)
    })
    return res.json({
      success: true,
      message: 'Update Balance Successfully',
      results: wallet
    })
  }catch(err){
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    })
  }
}

exports.deleteWallet = async (req, res) => {
  try{
    const wallets = await walletModel.findAll()
    const {id} = req.params
    console.log(wallets)
    console.log(id)
    for(let item in wallets){
      console.log(wallets[item['id']])
      if(String(wallets[item]['id']) === id){
        const wallet = await walletModel.delete(id)
        return res.json({
          success: true,
          message: 'Delete Success',
          results: wallet
        })
      }
    }
    return res.json({
      success: false,
      message: 'No Existing Data'
    })
  }catch(err){
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    })
  }
}