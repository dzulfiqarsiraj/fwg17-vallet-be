const userModel = require('../../models/users.model')
const argon = require('argon2')
const handleErr = require('../../helpers/utils')


exports.updatePin = async (req,res) => {
  const {id} = req.user
  try {
    if(req.body.pin){
      req.body.pin = await argon.hash(req.body.pin)
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
    handleErr.outError(err, res)
  }
}