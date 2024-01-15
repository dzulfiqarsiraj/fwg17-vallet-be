const usersModel = require('../models/users.model')
const argon = require('argon2')
const jwt = require('jsonwebtoken')

exports.login = async (req,res) => {
  try{
    const user = await usersModel.findOneByEmail(req.body.email)
  if(user){
    const password = await argon.verify(user.password, req.body.password)
    const token = jwt.sign({
      id: user.id
    }, process.env.APP_SECRET || 'secret')
    if(password){
      return res.json({
        success: true,
        message: 'Login Success',
        results: {
          token
        }
      })
    }else{
      throw 'wrong_password'
    }
  }else{
    throw 'wrong_password'
  }
  }catch(err){
    if(err === 'wrong_password'){
      return res.status(401).json({
        success: false,
        message: 'wrong email or password'
      })
    }
    console.error(err)
    return res.status(500).json({
      success: false,
      message: 'internal server error'
    })
  }
}