const userModel = require('../../models/users.model')
const argon = require('argon2')
const handleErr = require('../../helpers/utils')

exports.updatePassword = async (req,res) => {
  const {id} = req.params
  try {
    if(req.body.password){
      req.body.password = await argon.hash(req.body.password)
    }
    
    const col = []
    const values = [] 
  
    for(let i in req.body){
      values.push(req.body[i])
      col.push(`"${i}"=$${values.length+1}`)
    }

    const users = await userModel.update(id, col, values)
    if(users){
      return res.json({
        success: true,
        message: 'Update users successfully',
        results: users
      })
    }else{
      return res.status(404).json({
        success: false,
        message: 'users not found'
      })
    }
  }catch(err){
    handleErr.outError(err,res)
  }
}